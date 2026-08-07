# Foster Youth Swans

<a id="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/Sabrina-Moore/Showcase-Repo">
    <img src="./SEA Logomark.png" alt="Logo" width="180" height="80">
  </a>
  <a href="https://www.figma.com/board/KxkdqMKt3bYeVN9LcZAUV0/2026-Snap-Academies-Showcase-%F0%9F%91%BB?node-id=0-1&p=f&t=PlwTk6WeaVxioo26-0">

<h3 align="center">Snap Haven</h3>

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
    
  <p>
    <a href="https://github.com/Sabrina-Moore/Showcase-Repo"><strong>Explore the Docs Link»</strong></a>
    <br />
    <br />
    <a href="https://github.com/Sabrina-Moore/Showcase-Repo">View Demo Link</a>
  </p>

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

And when someone doesn’t have these networks, everything including social skills, job security, and housing stability is impacted. We found when researching nonprofits that specialize in providing services to this group that they are shifting their strategies to developing and maintaining support systems to build relational permanence. Having more robust social ties with peers, friends, and trusted adults leads to multidimensional support in the form of emotional, tangible, and informational support. 

So we thought, how might we help foster youth meaningfully connect to people and resources while experiencing a broken support system to deepen already existing connections?

That’s where our feature comes in, Haven, a new addition to the chat tab. It’s a toolkit that can be added to any chat for any user that needs additional support for facilitating conversation to nurture already existing connections with friends or trusted adults. This feature is optional and customizable, so users can integrate as much as they want into their chats, or remove anything that they find disruptive to their habits.

Video of feature here. 



<p align="right">(<a href="#readme-top">back to top</a>)</p>



## Features

Haven lives on the conversation screen and conversation profile screen. 

**Chat home screen**
- New UI to represent chats with this feature
- can long press already existing conversations to convert to a Haven conversation (adds these features without requiring a new chatroom)
- Notification system called "nudges" to remind users to reach out when the conversation becomes inactive for too long
- Nudges can also remind the user of important milestones and birthdays


**conversation creation screen**
- new tab for starting a Haven conversation


**Conversation screen**
- Users needing help to bridge a lull in conversation can get "conversation starting" prompts
- users can invite friends to their already existing Haven conversation, but must be approved by the members of that Haven
- Instead of the regular buttons next to the text input and keyboard, a plus button opens access to the main Haven Toolkit


**Conversation group profile screen**
- users can customize settings for all added features (changing interval if applicable, or turning off and on features)
- users can choose to update their "life banner" status to be seen by their Haven connections
- users can set an optional passcode for the chat so it cannot be opened on their phone app without that passcode for additional privacy (restricted to users with verified ages over 17)


**Supabase**
- tracks dummy data for user profiles
- tracks messages and conversations for realtime chatting
- Tracks conversation inactivty for notification system
- prompts table for users to get conversation starting prompts



## Tech Stack

- <a href="https://reactnative.dev/"> <img src="https://skillicons.dev/icons?i=react" alt="Tech Stack Icons" width="20" height="20" align="center" alt="React Native" /></a> **React Native** 
- <a href="https://expo.dev/"><img src="assets/techStackLogos/expogo2.png" width="20" height="20" align="center" alt="Expo Go" /></a> **Expo Go** (v51.0.0)
- <a href="https://supabase.com/"><img src="assets/techStackLogos/supabase-logo1.svg" height="22" align="center" alt="Supabase" /></a> **Supabase** for database storage
- <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript"><img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/javascript/javascript-original.svg" width="20" height="20" align="center" alt="JavaScript" /></a> **JavaScript**
- 💾 **AsyncStorage** for local session storage

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->

## Getting Started
This feature was designed using React Native and Expo with the IOS system in mind. 


### Prerequisites

To run this react native code, you will need to use the Expo Go app on your phone or a simulator like Xcode on mac computer. 


### Running code on Expo

### Installation

Install the Expo app on your phone. Download here for IOS and here for Android. 
Open the Expo app. 

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE EXAMPLES -->


## Contributions



### Installation

1. Make your own database in Supabase, holding data like profiles and chat prompts.
2. Follow instructions for connecting your project as a Framework for Expo React Native and copy the connection key. 
3. Clone the repo
   ```sh
   git clone https://github.com/github_username/repo_name.git
   ```
4. Install NPM packages
   ```sh
   npm install
   ```
5. Enter your API in `config.js`
   ```js
   const API_KEY = "ENTER YOUR API";
   ```
6. Change git remote url to avoid accidental pushes to base project
   ```sh
   git remote set-url origin github_username/repo_name
   git remote -v # confirm the changes
   ```



## Usage

Use this space to show useful examples of how a project can be used. Additional screenshots, code examples and demos work well in this space. You may also link to more resources.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->

## License

Distributed under the project_license. See `LICENSE.txt` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->

[license-url]: https://github.com/github_username/repo_name/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://linkedin.com/in/linkedin_username
[product-screenshot]: images/screenshot.png
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[Vue.js]: https://img.shields.io/badge/Vue.js-35495E?style=for-the-badge&logo=vuedotjs&logoColor=4FC08D
[Vue-url]: https://vuejs.org/
[Angular.io]: https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white
[Angular-url]: https://angular.io/
[Svelte.dev]: https://img.shields.io/badge/Svelte-4A4A55?style=for-the-badge&logo=svelte&logoColor=FF3E00
[Svelte-url]: https://svelte.dev/
[Laravel.com]: https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white
[Laravel-url]: https://laravel.com
[Bootstrap.com]: https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white
[Bootstrap-url]: https://getbootstrap.com
[JQuery.com]: https://img.shields.io/badge/jQuery-0769AD?style=for-the-badge&logo=jquery&logoColor=white
[JQuery-url]: https://jquery.com

## Let's talk resouces

🌳 If you want to implement a table or bold text or even bullet point, use this [documentation](https://google.github.io/styleguide/docguide/style.html) to get the right syntax. Don't be afraid to look at other templates and pull the parts and types you like! Sharing is caring.


## Git Push Instructions:
- git switch dev branch
- git git add "specific files". DON'T DO "."
- git commit -m "name, what you did, files you modified"
- git push origin dev branch name
- make pr -> commit pr. Ensure you are on our project branch as main, and push from your dev branch
- git swtich main
- git pull origin main

- git swtich dev branch name (IF YOU ARE NOT THE ONE WHO COMMITED THE CHANGE)
- git merge main (IF YOU ARE NOT THE ONE WHO COMMITED THE CHANGE)



