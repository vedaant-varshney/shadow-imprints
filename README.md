# Shadow Imprints
Viewer-Participants are "transported" into a child's bedroom, where they are free to explore and leave imprints of their hands within the scene, reminiscent of shadow puppets made in front of projectors or lamplights. Everyone will interact with the piece differently, and *Shadow Imprints* gives full creative freedom to participants to create whatever they desire.   

## Running and Usage
- Clone code from repository
- Start VSCode Live Server from root
- Ensure webcam is enabled
- Focus/Click on the screen to enable audio if needed
- Press `H` to hide settings GUI
- `Left Click` to clear shadow state if desired

- ml5 is pinned to the 1.x line (`ml5@1`); `ml5@latest` would float to a future major version with breaking API changes (the sketch uses the 1.x `handPose` / `detectStart` API).
- Library paths in `index.html` are relative (`./_common/...`), so the piece can also be served from a sub-path (e.g. as a git submodule in the website) instead of only from a site root.


## Formal Qualities

*Shadow Imprints* takes place in a 3D environment modelled after a child's bedroom, featuring a starry wallpaper, carpet, and a rug. The scene is bathed in a dim, warm light, with the view outside showcasing that it is a moonlit night. In the background, a quiet dreamscape continuously plays.

Within this scene, viewer participants are able to use their hands to cast shadow puppets into the room, reacting to their movements in realtime. Each shadow responds authentically, bending and distorting at wall seams as they would in a real room. The clock hand moves to indicate the time a user has to make each shadow puppet. Prior to the time running out, the clock audibly ticks and a shutter sound plays, after which the participant's hands are imprinted onto the scene. From here, they can freely add to this scene with new imprints, or collaborate with others. Upon reaching a maximum number of hands, the least recent puppet imprinted is removed from the environment.  
## Context

Shadow puppetry or *shadowgraphy* is the "art of performing a story or show using images made by hand shadows" (“Shadowgraphy”), and one that I have participated in casually for as long as I can remember. While it is traditionally performed using candlelight, incandescent lamplight or projector screens, my most vivid childhood memories involve making shadow puppets with my night light. This piece aims to share the joy of experimentation I had in contorting my hands and collaborating with my parents to create new shapes and creatures.

*Shadow Imprints* lightly deviates from the traditional shadow puppet notion by having the concept of semi-permanent imprints that can have multiple participants or be developed upon over time. This increases the complexity of shadow forms that users can make to compensate for limitations in hand tracking technology. 

The viewer-participant is expected to feel a sense of exploratory joy and whimsy, as they discover cool patterns, shapes, and figures they are able to create in the scene. The accompanying music is meant to evoke the dreamlike wonder and a sense of nostalgia for one's childhood, even if the participant's childhood looked very different. 

The main interpretation of the piece is how it highlights that even the simplest of shapes can be imagined as fiery dragons or sweeping landscapes, one only needs to have the right frame of mind. My goal was to give the viewer-participants freedom in their expression, and to aid them in reliving or recreating simpler times (in their childhood). It plays with the idea of how creativity and imagination tend to dull over time, stemming from responsibilities or the need for perfect execution. By limiting the medium to one's hand, there is a sense of physical embodiment in the piece, allowing them to imperfectly create whatever they can imagine. 
