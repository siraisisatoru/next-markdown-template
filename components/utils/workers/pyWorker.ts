import { expose } from "comlink";

declare const self: Worker & {
    pyodide?: any;
    loadPyodide: (options: { indexURL: string }) => Promise<any>;
};
importScripts("https://cdn.jsdelivr.net/pyodide/v0.25.1/full/pyodide.js");

let pyodideReady = self.loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.25.1/full/" });

function parseLibraries(metaInfo: string) {
    // GPT
    // Convert the metaInfo to lowercase to handle case-insensitive parsing
    const lowerMetaInfo = metaInfo.toLowerCase();
    // Find the index of "run" in the lowercase metaInfo
    const runIndex = lowerMetaInfo.indexOf("run");
    // If "run" is not found, return an empty array
    if (runIndex === -1) {
        return [];
    }

    // Find the substring starting from "run" to the end of the metaInfo
    const substring = lowerMetaInfo.substring(runIndex);
    // Find the index of "[" in the substring
    const startIndex = substring.indexOf("[");
    // Find the index of "]" in the substring
    const endIndex = substring.indexOf("]");
    // If "[" and "]" are not found, return an empty array
    if (startIndex === -1 || endIndex === -1) {
        return [];
    }

    // Extract the substring containing the array elements
    const arraySubstring = substring.substring(startIndex + 1, endIndex);
    // Replace single quotes with double quotes for consistent parsing
    const replacedSubstring = arraySubstring.replace(/'/g, '"');
    // Parse the substring as JSON to convert it into an array
    let libraries: string[];
    try {
        libraries = JSON.parse("[" + replacedSubstring + "]");
    } catch (error) {
        console.error("Error parsing library array:", error);
        return [];
    }

    // Convert each library name to lowercase
    return libraries.map((library) => library.toLowerCase());
}

const pyodideWorker = {
    async init(): Promise<void> {
        self.pyodide = await pyodideReady;
        var setup_code = `
        import sys, io, traceback
        namespace = {}  # use separate namespace to hide run_code, modules, etc.
        def run_code(code):
          """run specified code and return stdout and stderr"""
          out = io.StringIO()
          oldout = sys.stdout
          olderr = sys.stderr
          sys.stdout = sys.stderr = out
          try:
              # change next line to exec(code, {}) if you want to clear vars each time
              # exec(code, namespace)
              exec(code, {})
          except:
              traceback.print_exc()
        
          sys.stdout = oldout
          sys.stderr = olderr
          return out.getvalue()
        `;
        const result = await self.pyodide.runPythonAsync(setup_code);
    },
    async runPython(code: string, metaInfo: string): Promise<string> {
        const libList = parseLibraries(metaInfo);

        if (libList.length == 0) {
            await self.pyodide.loadPackagesFromImports(code);
        } else {
            // there is package list
            console.log("Manual lib: ", libList);
            await self.pyodide.loadPackage(libList);
        }

        self.pyodide.globals.set("code_to_run", code);

        const output = await self.pyodide.runPythonAsync("run_code(code_to_run)");

        // const result = await self.pyodide.runPythonAsync(code);
        return output;
    },
};

expose(pyodideWorker);
