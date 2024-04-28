declare module 'remark-collapse' {
    import { Node } from 'unist';
    import { Test, Handler } from 'mdast-util-heading-range';
  
    type Summarizer = (str: string) => string;
  
    interface Options {
      test: Test;
      summary?: string | Summarizer;
    }
  
    function remarkCollapse(opts: Options): Plugin<[(RemarkEmojiOptions | null | undefined)?], Root>;
  
    export = remarkCollapse;
  }
  