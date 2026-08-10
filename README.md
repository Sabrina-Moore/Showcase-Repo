# Foster Youth Swans

<a id="readme-top"></a>

<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a>
    <img src="./assets/HavenLogo2.png" alt="Logo" width="180" height="180">
  </a>

<h1 align="center">Snap Haven</h1>

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
      <a href="#running-the-app">Running the App</a>
      <ul>
        <li><a href="#getting-started">Getting Started</a></li>
      </ul>
      <a href="#getting-started">Contributions</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#getting-started">Getting Started</a></li>
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

- New UI to represent chats with this feature
- Can long press already existing conversations to convert to a Haven conversation (adds these features without requiring a new chatroom) or enter from "New Chat" button
- Users needing help to bridge a lull in conversation can get "conversation starting" prompts
- Instead of the regular game button next to the text input and keyboard, a plus button opens access to the main Haven toolkit
- Users can send "nudges" to their Haven conversation to check-in, send a reminder about an anniversary, and more. 
- Users can choose to update their mood + need status to be sent to their Haven conversation


**Stretch Milestones**
- "Nudges" expanded to remind users to reach out when the conversation becomes inactive for too long (based on lastest message timer)
- Users can customize settings for all added features (changing interval if applicable, or turning off and on features)
- Users can invite friends to their already existing Haven conversation, but must be approved by the members of that Haven
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

## Running the App
This prototype is run using React Native, Expo and Mac's Xcode simulator. The prototype has better compatibility with IOS, but works on Android. 

Because we have no hosted this code on the internet, you will need to be able to save the repository locally and run it to get the Expo QR code. 

You will need to have access to and some familiarity with terminal commands. 


<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Getting Started

1. Install the [Expo app](https://expo.dev/go) on your IPhone or Android. 
2. Make an Expo account.
3. Open terminal on your computer. 
4. Install [Node.js](https://nodejs.org/en/download) to run other dependencies
5. List the files and folders inside your current directory, move into a sub-folder or file, or move backwards to a parent directory
```sh
ls
cd filename
cd ..
```
6. In your terminal (or documents folder), make a new folder directory to house the code
```sh
mkdir foldername
```
7. Move terminal location into the folder
```sh
cd foldername
```
8. Clone this repository
```sh
git clone https://github.com/your-github-name/Showcase-Repo.git .
```
9. Install project dependencies with the code 
```sh
npm install
```
10. Run the code
```sh
code .
```
11. Open your Expo Go app


<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Contributions
Contributors are welcome! If you'd like to improve the problem, fix a bug, add a feature, or anything else you can think of, we'd love your input. 

Before getting started:
1. Read through the code carefully as well as any open issues and pull requests.
2. Make your pull requests detailed and specific - don't commit a lot of changes and push them all together as it makes reading and debugging more difficult.
3. Please include screenshots or screen recordings in your pull requests and issues. 

Thanks for your help and we appreciate your interest in our feature!

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Prerequisites
Before contributing, ensure you have the following installed:
- Install **Node.js** (LTS version) on your machine.
- Install **Git** for terminal command interactions with Github. 
- Install **Expo Go** on your phone or Xcode on Mac.
- Install **Visual Studio Code** or any other preferred code editor or IDE.

### Getting Started
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
This code relies on dynamic rendering from fetching from and inserting into supabase tables. 
1. Create a supabase account
2. Create a new project
   - Link to your github repository
   - Name your project
   - Create a database password
3. Connect to your project ("connect" button near the top)
   - Framework = Expo React Native
   - Run npm installation inside terminal
   - create .env.local file if you haven't already and add supabase_url and supabase_key
   - Ensure that gitignore properly lists .env.local
5. Create tables


#### Supabase Tables

<a>  profiles table
<img width="1360" height="27" alt="Screenshot 2026-08-10 at 02 28 21" src="https://github.com/user-attachments/assets/80894959-722f-416b-9480-9c56fc5d893b" />
</a> 
<a> conversations table
<img width="842" height="31" alt="Screenshot 2026-08-10 at 02 24 12" src="https://github.com/user-attachments/assets/dce8abe0-53ae-435c-9585-be323e060943" />
</a> 
<a>  conversation_members table
<img width="844" height="30" alt="Screenshot 2026-08-10 at 02 26 45" src="https://github.com/user-attachments/assets/559e4f27-f8e9-43f7-bd67-5f11d1c76fbd" />
</a> 
<a>  prompts table
< br/>
<img width="622" height="32" alt="Screenshot 2026-08-10 at 02 27 08" src="https://github.com/user-attachments/assets/7f267b97-28b7-4ff1-a3dc-a97234d2aad7" />
</a> 


<br /> 

Foreign keys:
profiles
  - Foreign Key: user_id -> auth.users_id
conversation_members
  - Foreign key: conversation_id -> public.conversations.conversation_id
  - foreign key: user_id -> public.profiles.user_id
messages
  - Foreign key: conversation_id -> public.conversations.conversation_id
  - Foreign key: sender_id -> public.profiles.user_id
prompts
  - prompt_id is identity (unique numbers)


Most of the tables will need RLS policies:
- Enable read access for all users: every table
- Enable insert for users based on user_id: profiles
- Enable insert for authenticated users only: conversations, messages

SQL Prompts:
Randomize prompts (random order with unique categories, limit of 3)
```sql
DROP FUNCTION IF EXISTS get_random_prompts();
DROP FUNCTION IF EXISTS get_random_prompts(integer);
DROP FUNCTION IF EXISTS get_random_unique_category_prompts();

create function get_random_prompts()
returns setof prompts
language sql
as $$
 select distinct on (category) *
  from (
    select *
    from prompts
    order by random()
  ) sub
  limit 3;
$$;
```
Allow user_id to be in multiple conversations
```sql
ALTER TABLE public.conversation_members
DROP CONSTRAINT conversation_members_pkey;

ALTER TABLE public.conversation_members
ADD CONSTRAINT conversation_members_pkey
PRIMARY KEY (user_id, conversation_id);
```
Members can update their conversations
```sql
create policy "Members can update their conversations"
on conversations for update
using (auth.uid() in (
  select user_id from conversation_members where conversation_id = conversations.conversation_id
));
```


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







