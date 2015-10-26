# Reel Cool
Reel Cool is an in-browser video editor. We set out to make a video editing tool that would be fun to use and wouldn't require a powerful computer to run. Visit us at [www.reelcool.co](www.reelcool.co) to try it out!

## Screenshots
![Splash Page](https://raw.githubusercontent.com/reelcool/reelcool/master/server/files/assets/ReelCoolScreenshot1.png)
![Making Movies](https://raw.githubusercontent.com/reelcool/reelcool/master/server/files/assets/ReelCoolScreenshot2.png)
![Real-Time Preview Player](https://raw.githubusercontent.com/reelcool/reelcool/master/server/files/assets/ReelCoolScreenshot3.png)

## Contributors
We are proud to have made Reel Cool as our capstone project at [Fullstack Academy](http://www.fullstackacademy.com/)!
- [Kathy Lu](https://github.com/warsucks)
- [Cristina Colón](https://github.com/kriztynna)
- [Stephen Spellman](https://github.com/Spells24)
- [Daniel Moennich](https://github.com/dmoennich)

## Browser compatibility
Reel Cool uses the [MediaSource Web API](https://developer.mozilla.org/en-US/docs/Web/API/MediaSource) to read buffers directly into the video elements. To view and edit videos, you'll need to use a browser that supports MediaSources.

On the desktop, the MediaSource API is supported in Chrome v23+ by default. Firefox v25+ also supports MediaSource, but the user has to switch it on first. IE v11+ supports MediaSource on Windows v8+.

Mobile browsers don't support MediaSource yet, but you can still visit our site from a mobile device to upload videos. When you sign on from the desktop, Reel Cool will show you the videos you uploaded from your mobile.

## File formats
We found that the [.webm video format](http://www.webmproject.org/) was the one that worked best with MediaSource elements. When a user uploads a .webm file, it is immediately embedded into the webpage and ready to use, while the upload happens in the background. Although this functionality doesn't yet enjoy wide cross-browser support, we chose to implement it so that we could explore the possibilities offered by these emerging standards.

To make Reel Cool accessible to more people, the app accepts uploads from any format and performs the conversion itself. That way, you can upload directly from your mobile device, which most likely stores videos in .mp4 or .MOV formats.

When you request a download from Reel Cool, we send you an .mp4 file. We chose that format because it is more widely used than .webm, and accepted by most social sharing services.
