# Foster Youth Swans

<a id="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/Sabrina-Moore/Showcase-Repo">
    <img src="./assets/HavenLogo.png" alt="Logo" width="180" height="180">
  </a>
  <a href="https://www.figma.com/board/KxkdqMKt3bYeVN9LcZAUV0/2026-Snap-Academies-Showcase-%F0%9F%91%BB?node-id=0-1&p=f&t=PlwTk6WeaVxioo26-0">

<h3 align="center">Snap Haven</h3>

<h3 align="center">
  A little nudge. A bigger connection.
</h3>

<br />

 <p align="center">
    React Native feature for Snapchat
    <br />
  </p>

    
  | Foster Youth   | Members                          |
  | -------------- | ------------------------------   |
  |  Storytelling  | Devan Jue and Hadassah Pryor     |
  |  Design        | Kenner Valentin and              |
  |                | Christopher Gonon-Maldonado      |
  |  Engineering   | Sabrina Moore and Shawn Seo      |
    


</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
         <li><a href="#features">Pitch</a></li>
         <li><a href="#features">Features</a></li>
        <li><a href="#tech-stack">Tech Stack</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
      <a href="#getting-started">Contributions</a>
      <ul>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#how-to-make-code-changes-in-the-terminal">Making Changes</a></li>
        <li><a href="#file-structure">File Structure </a></li>
        <li><a href="#creating-your-own-supabase">Creating a Supabase Project</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->


## About The Project

As part of the Snap Academy, an educational program for community college students run by the Snap Philanthropy and Next Shift Learning teams, our team assigned to solve a need for the "Foster Youth" audience and implement that solution as a feature to Snapchat.


### Haven (Snapchat feature)

Foster Youth on average will be placed in three different homes before reaching 18. Each time they move, they start from scratch with their support system. A new home, new guardians, maybe even new friends if they move to a different school zone. From a study by Portland State University that interviewed foster youth in California, they identified “times of transition as disruptive to the stability and longevity of relationships.” 

And when someone doesn’t have these networks, **everything** including social skills, job security, and housing stability is impacted. We found when researching nonprofits that specialize in providing services to this group that they are shifting their strategies to developing and maintaining support systems to build relational permanence. Having more robust social ties with peers, friends, and trusted adults leads to multidimensional support in the form of emotional, tangible, and informational support. 

So we thought, how might we **help** foster youth meaningfully connect to people and resources while experiencing a broken support system to deepen already existing connections?

That’s where our feature comes in, **Haven**, a new addition to the chat tab. It’s a **toolkit** that can be added to any chat for any user that needs additional support for facilitating conversation to nurture already existing connections with friends or trusted adults. This feature is optional and customizable, so users can integrate as much as they want into their chats, or remove anything that they find disruptive to their habits.

Video of feature here. 



<p align="right">(<a href="#readme-top">back to top</a>)</p>



## Features

Haven lives on ConversationScreen.js, ConversationProfileScreen.js and HavenTools.js. 

**Chat screen**
- New UI to represent chats with this feature
- Can long press already existing conversations to convert to a Haven conversation (adds these features without requiring a new chatroom)
- Notification system called "nudges" to remind users to reach out when the conversation becomes inactive for too long
- Nudges can also remind the user of important milestones and birthdays


**conversation creation screen**
- New tab for starting a Haven conversation


**Conversation screen**
- Users needing help to bridge a lull in conversation can get "conversation starting" prompts
- Users can invite friends to their already existing Haven conversation, but must be approved by the members of that Haven
- Instead of the regular buttons next to the text input and keyboard, a plus button opens access to the main Haven Toolkit


**Conversation group profile screen**
- Users can customize settings for all added features (changing interval if applicable, or turning off and on features)
- Users can choose to update their "life banner" status to be seen by their Haven connections
- Users can set an optional passcode for the chat so it cannot be opened on their phone app without that passcode for additional privacy (restricted to users with verified ages over 17)


**Supabase**
- Tracks dummy data for user profiles
- Tracks messages and conversations for realtime chatting
- Tracks conversation inactivity for notification system
- Prompts table for users to get conversation starting prompts

<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Tech Stack

- <a href="https://reactnative.dev/"> <img src="https://skillicons.dev/icons?i=react" alt="Tech Stack Icons" width="20" height="20" align="center" alt="React Native" /></a> **React Native**
- <a href="https://expo.dev/"><img src="assets/techStackLogos/expogo5.png" width="20" height="20" align="center" alt="Expo Go" /></a> **Expo Go** (v54.0.36)
- <a href="https://supabase.com/"><img src="assets/techStackLogos/supabase-logo1.svg" height="22" align="center" alt="Supabase" /></a> **Supabase** for database storage
- <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" width="20" height="20" align="center" alt="JavaScript" /></a> **JavaScript**
- 💾 **AsyncStorage** for local session storage

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started
This prototype is run using React Native, Expo and Mac's Xcode simulator. The prototype has better compatibility with IOS, but works on Android. 



<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Installation

1. Install the Expo app on your phone. Download here for IOS and here for Android.
2. Make an Expo account. 
3. Install Node.js
4. Clone this repository
5. Install project dependencies
6. Run the code
7. Open your Expo Go app


<p align="right">(<a href="#readme-top">back to top</a>)</p>


## Contributions
For developers, we welcome contributions. 

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Prerequisites
Before contributing, ensure you have the following installed:
- Install **Node.js** (LTS version) on your machine.
- Install **Git** for terminal command interactions with Github. 
- Install **Expo Go** on your phone or Xcode on Mac.
- Install **Visual Studio Code** or any other preferred code editor or IDE.

### Installation
1. Check your installations
  ```bash
  node --version
  npm --version
  git --version
  ```
2. Fork the repository 
   - Navigate to Showcase-Repo and click the fork button on the top right corner
   - Choose your own account as the owner
3. Create a local folder on your computer and navigate inside that folder in your terminal
4. Clone your forked repository inside that folder
   ```sh
   git clone https://github.com/github_username/repo_name.git .
   ```
5. Install NPM packages/dependencies
   ```sh
   npm install
   ```
6. Open the code
   ```sh
   code .
   ```
5. Create your own .env.local file to connect to a supabase project
   ```js
   EXPO_PUBLIC_SUPABASE_URL=
   EXPO_PUBLIC_SUPABASE_KEY=
   ```
7. Run the code with Expo Go (or another simulator)
   ```sh
   npx expo start
   ```
9. After running the above command:
- The development server will start, and you'll see a QR code inside the terminal window.
- Scan that QR code to open the app on the device. On Android, use the Expo Go > Scan QR code option. On iOS, use the default camera app.
10. Test the code and make changes


<p align="right">(<a href="#readme-top">back to top</a>)</p>

### How to make code changes in the terminal

1. Create and switch to a new development branch
   ```sh
   git switch -c branch-name
   ```
3. Make your code changes on that branch
   - Save the individual file
5. Stage the changed files. While you could use the shortcut "." after the file name to add all changed files, I encourage you to be careful of what files you push.
   ```sh
   git add fileName otherFileName
   ```
6. Make your commit
   ```sh
   git commit -m "Description of code"
   ```
7. Push your code
   ```sh
   git push origin branch-name
   ```
9. On this repository, navigate to the "Pull Requests" tab inside your github repo and create a new request. Be aware that you will need to change the branches to be set to your own forked repo not the original forked repo called "Starter26" or this repo called "Showcase-Repo."
10. After your Pull request is made and has been merged, you will then want to update your local main. Move from your development branch to main.
    ```sh
    git switch main
    ```
12. Pull the remote main to your local main.
    ```sh
    git pull origin main
    ```
14. If you are not the one who made the code changes, you will need to update your local development branch now. Switch to your development branch to merge with main. 
    ```sh
    git switch branch-name
    git merge main
    ```
<p align="right">(<a href="#readme-top">back to top</a>)</p>

### File Structure

- assets - Images, Icons, and fonts
- src/components - Reusable components that provide UI or logic for a specific purpose
- src/navigation - Controls navigation between screens and bottom tabs
- src/screens - Individual screens/pages of the application
- utils/hooks - Custom hooks and Helper code that facilitate supabase functionality and session authentication
- .env.local - Local file that holds supabase connection keys/credentials: ignored by Git for privacy
- App.js - Builds top-level component and initiates root navigation (renders loading screen)
- Index.js - Application start point that sets App.js as root component
- package.json - project dependencies
- README.md - Project documentation

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Creating your own Supabase


<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Helpful Resources
If you're new to React Native or Expo, these resources can help:
- [Expo Documentation](https://docs.expo.dev/tutorial/create-your-first-app/)
- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [React Navigation Documentation](https://reactnavigation.org/docs/getting-started)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the project_license. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>



## Let's talk resources

🌳 If you want to implement a table or bold text or even bullet point, use this [documentation](https://google.github.io/styleguide/docguide/style.html) to get the right syntax. Don't be afraid to look at other templates and pull the parts and types you like! Sharing is caring.






