import {
    Backpack,
    Browser,
    Cat,
    CreditCard,
    File,
    Folder,
    Ghost,
    IceCream,
    Mug,
    Planet,
    SpeechBubble,
    Chocolate,
} from "react-kawaii";

import yaml from "js-yaml";

interface Props {
    config: string;
}

interface Config {
    type: string;
    color: string;
    mood: string;
    size: number;
}

interface CharactorComponents {
    [key: string]: React.ComponentType<any>;
}

const CharacterRender = (renderProps: Props) => {
    let config: Config = {
        type: "cat",
        color: "#FFD882",
        mood: "sad",
        size: 240,
    };

    const configJson = yaml.load(renderProps.config) as Partial<Config>;
    config.type = (configJson?.type || config.type).toLowerCase();
    config.color = configJson?.color || config.color;
    config.mood = configJson?.mood || config.mood;
    config.size = Number(configJson?.size) || config.size;

    const components:CharactorComponents = {
        backpack: Backpack,
        browser: Browser,
        creditCard: CreditCard,
        file: File,
        folder: Folder,
        ghost: Ghost,
        iceCream: IceCream,
        mug: Mug,
        planet: Planet,
        speechBubble: SpeechBubble,
        chocolate: Chocolate,
        cat: Cat,
    };
    const KawaiiCharacter = components[config.type];
    return <KawaiiCharacter color={config.color} mood={config.mood} size={config.size} />;
};

export default CharacterRender;
