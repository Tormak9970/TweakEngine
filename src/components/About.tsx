import { ModalRoot } from "decky-frontend-lib";
import { Fragment, VFC } from "react";

type AboutModalProps = {
    closeModal: () => void,
}

export const AboutModal: VFC<AboutModalProps> = ({
    closeModal,
}) => {
    
    return (
        <>
            <ModalRoot
            bAllowFullSize
            onCancel={closeModal}
            onEscKeypress={closeModal} >
                <div style={{fontSize: "14px"}}>
                    <h2 style={{marginTop: "0px"}}>TweakEngine</h2>
                    <div>This plugin provides options to tweak various parts of SteamOS.</div>
                    <h3>Feature Requests and Contributing</h3>
                    <div>Got an idea for a new tweak? Fork Tweak Engine, make your tweak, and then making a PR here. I will review it when I have time and merge it if there are no issues. (Read more on the Github Readme)</div>
                    <br/>
                    <div>Don't have the technical knowhow to make one yourself? Well there's no time like the present to start learning!</div>
                    <br/>
                    <div>Jokes aside, please feel free to open an <b>issue</b> on Tweak Engine's Github repository with a subject formatted like so: <b>Tweak: your idea</b>. I will review it when I have the chance and if it seems like a good suggestion I will try to implement it.</div>
                    <br/>
                    
                    <div>Author: Tormak</div>
                </div>
            </ModalRoot>
        </>
    )
}