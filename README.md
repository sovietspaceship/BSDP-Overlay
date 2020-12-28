# sovietspaceship's Beat Saber Overlay

Beat Saber overlay based on [BSDP-Overlay](https://github.com/kOFReadie/BSDP-Overlay) by [kOFReadie](https://github.com/kOFReadie) (thank you!),
cleaned up and oriented to ranked play.

It displays ScoreSaber player data and adds difficulty, star rating and max PP to the song info. It also removes the health bar and the modifiers.

To use this overlay, add a Browser source to the Scene tab in OBS and set URL to overlay/index.html with the appropriate query params,
e.g. file:///whatever/BSDP-Overlay/overlay/index.html?scoresaberPlayerId=111111&bgColor=FF0&textColor=FF0. No custom CSS needed.

Required the [DataPuller](https://github.com/kOFReadie/BSDataPuller) Beat Saber mod by [kOFReadie](https://github.com/kOFReadie) (check ModAssistant or download from https://github.com/kOFReadie/BSDataPuller/releases)

# Query Parameters

- `scoresaberPlayerId`: your ScoreSaber id e.g. 76561198445999731 in https://scoresaber.com/u/76561198445999731
- `bgColor`: background colour (web colour or hex triplet, e.g. FF00FF, without #)
- `textColor`: text colour (see above)
