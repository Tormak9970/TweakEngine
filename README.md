# Tweak Engine

A plugin to tweak various parts of SteamOS.


![Main View](./assets/thumbnail.png)
<br/>
<br/>

# Overview
This plugin provides options to tweak various parts of SteamOS.
<br/>
<br/>

# Feature Requests and Contributing
Got an idea for a new tweak? Fork Tweak Engine, make your tweak, and then making a PR here. I will review it when I have time and merge it if there are no issues. (Read more below)
<br/>
<br/>
Don't have the technical knowhow to make one yourself? Well there's no time like the present to start learning!
<br/>
<br/>
Jokes aside, please feel free to open an `issue` on Tweak Engine's Github repository with a subject formatted like so: `Tweak: your idea`. I will review it when I have the chance and if it seems like a good suggestion I will try to implement it.
<br/>
<br/>

# Contributing your own Tweaks
In order to add a tweak, you need to add an entry to the default settings in `main.py`, create a new tweak in `src/lib/tweaks`, and register it in `src/lib/TweakEngineManager.ts`.

## Updating the default settings
In the `main.py` file there is a `defaults` property on the Plugin class. Add an entry with the name of your tweak. Make sure it is short and replace any spaces with a `-`. Initialize it to `False` and provide a description of your tweak. It should look something like:<br/>
```python
defaults = {
    #other tweaks
    "Your-Tweak-Name": {
        "name": "Your-Tweak-Name",
        "description": "A description of your tweak",
        "enabled": False
    }
}
```

## Creating your tweak
Now comes the fun part, making your tweak. Depending on what your goal is, the amount of work it will take to make can vary extensively, but to start I recommend duplicating the `src/lib/tweaks/TemplateTweak.tsx` file and using it as a starting point.
<br/>
<br/>
In general, your logic should go in the `init` method, and any cleanup should be done in the `onDismount` method.
<br/>
<br/>
Additionally, there are some guidelines you need to follow:<br/>
 - You must document your methods using the [JSDoc](https://jsdoc.app/) spec
 - You must fill out the comments in the template annotated with `TODO:`
 - Your tweak must perform well, otherwise it can't be included
 - Any patching you do **MUST** be removed in the `onDismount` method

Finally, please write readable code, and use good conventions for TypeScript. If its difficult to review, that will greatly decrease the probability of me incorporating it in the plugin.

## Registering your tweak
Finally, you need to register the tweak file. To do this, open `src/lib/TweakEngineManager.ts` and add an entry to the map that points to your tweak. It should look something like:<br/>
```ts
static tweaks:Map<string, Tweak<ServerAPI>> = new Map<string, Tweak<ServerAPI>>([
    ['Game-Download-Status', new GameStatusTweak()],
    // other tweaks
    ['Your-Tweak-Name', new YourTweak()],
]);
```
With that done, your ready to open a Pull Request on this repo!
<br/>
<br/>

# Installation
1. [Install the Decky plugin loader](https://github.com/SteamDeckHomebrew/decky-loader#installation)
2. Use the built in plugin store to download the Tweak Engine Plugin