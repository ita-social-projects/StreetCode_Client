
<a href="https://softserve.academy/">
  <img src="https://raw.githubusercontent.com/ita-social-projects/StreetCode/master/StreerCodeLogo.jpg" 
  title="SoftServe IT Academy" 
  alt="SoftServe IT Academy">
</a>

# Streetcode

This is a front-end part of our Streetcode project.
Back-end part: https://github.com/ita-social-projects/StreetCode.git.

[![Build Status](https://img.shields.io/travis/ita-social-projects/StreetCode/master?style=flat-square)](https://travis-ci.org/github/ita-social-projects/StreetCode) [![Coverage Status](https://img.shields.io/gitlab/coverage/ita-social-projects/StreetCode/master?style=flat-square)](https://coveralls.io) [![Github Issues](https://img.shields.io/github/issues/ita-social-projects/StreetCode?style=flat-square)](https://github.com/ita-social-projects/StreetCode/issues) [![Pending Pull-Requests](https://img.shields.io/github/issues-pr/ita-social-projects/StreetCode?style=flat-square)](https://github.com/ita-social-projects/StreetCode/pulls) [![License](http://img.shields.io/:license-mit-blue.svg?style=flat-square)](http://badges.mit-license.org)

---

## Table of Contents

- [Streetcode](#streetcode)
  - [Table of Contents](#table-of-contents)
  - [Installation](#installation)
    - [Required to install](#required-to-install)
    - [Clone](#clone)
    - [Setup](#setup)
      - [Setting Up Workbox in Our Project](#setting-up-workbox-in-our-project)
        - [Prerequisites](#prerequisites)
      - [Installation Steps](#installation-steps)
    - [How to run local](#how-to-run-local)
  - [Usage](#usage)
    - [How to run tests](#how-to-run-tests)
  - [Documentation](#documentation)
  - [Contributing](#contributing)
    - [Gitflow](#gitflow)
      - [Step 1](#step-1)
      - [Step 2](#step-2)
      - [Step 3](#step-3)
      - [Step 4](#step-4)
      - [Step 5](#step-5)
      - [Step 6](#step-6)
      - [Step 7](#step-7)
      - [Step 8](#step-8)
      - [Step 9](#step-9)
    - [Hotfixes](#hotfixes)
      - [Step 1](#step-1-1)
      - [Step 2](#step-2-1)
    - [Issue flow](#issue-flow)
  - [Team](#team)
  - [FAQ](#faq)
  - [Support](#support)
  - [About Us](#about-us)
  - [License](#license)

---

## Installation

First of all, make sure you have installed dependencies below and back-end part of project from: 
https://github.com/ita-social-projects/StreetCode.git.

### Required to install
* NodeJS (16.0.0) or higher
* npm (7.10.0) or higher
* npx (10.2.2) or higher

### Clone

Clone this repo to your local machine using: 
```
git clone https://github.com/ita-social-projects/StreetCode_Client.git
```

### Setup
To setup this project use this command in project folder:
```
npm install
```

#### Setting Up Workbox in Our Project

To facilitate the usage of Workbox in our project, we have a few setup steps. Follow these instructions carefully:

##### Prerequisites

Before proceeding, ensure you have [Chocolatey](https://chocolatey.org/install) installed on your system.

#### Installation Steps

1. Install `mkcert` by running the following command from PowerShell (administrative):
   ```
   choco install mkcert
   ```
2. Create a `cert` folder in the root directory of your project.
3. Navigate to the `cert` folder in your console.
4. Run the following commands to generate SSL certificates:
```
mkcert -install
```
```
mkcert localhost 127.0.0.1
```

### How to run local
To start project locally, write following command:
```
npm start
```
Open your browser and enter http://localhost:3000 url.
If you had this page already opened, just reload it. 

---

## Usage
### How to run tests


---

## Documentation
Learn more about our documentation <a href="https://github.com/ita-social-projects/StreetCode_Client/wiki" target="_blank">*here*</a>.

---

## Contributing

### Gitflow

Gitflow is a lightweight, branch-based workflow.

Gitflow is an alternative Git branching model that involves the use of feature branches and multiple primary branches.

#### Step 1

- First step is checkout to `develop` branch and pull the recent changes.

#### Step 2

- 🍴 Fork this repo from `develop` branch and name it! A short, descriptive branch name enables your collaborators to see ongoing work at a glance. For example, `increase-test-timeout` or `add-code-of-conduct`. 

#### Step 3

- 🔨 On your branch, make ANY reasonable & desired changes to the repository.

#### Step 4

- :chart_with_upwards_trend: Commit and push your changes to your branch. 
Give each commit a descriptive message to help you and future contributors understand what changes the commit contains. 
For example, `fix typo` or `increase rate limit`. Note: you don't need to commit every line of your code in separate commits.

#### Step 5

- Before creating pull request you need to check the `develop` branch state! To avoid conflicts, you should merge `develop` branch to your local branch! And resolve your local conflicts. Mini manual: checkout to your local branch and write in console `git merge develop`.

#### Step 6

- 🔃 Create a new pull request using <a href="https://github.com/ita-social-projects/StreetCode_Client/pulls" target="_blank">*this link*</a>.

#### Step 7

- :raising_hand: Assign reviewers! Reviewers should leave questions, comments, and suggestions. After receiving comments, improve the code. Get Approved status on the request and be satisfied with it! 

#### Step 8

- :tada: After 3 approved reviews, merge your pull request with `develop` branch! Also, it is important to wait for your scrum master to approve your changes. If there are some conflicts, resolve them, again.

#### Step 9

- :scissors: Delete redundant branch. Done!

### Hotfixes

Oops, some fixed needs to be done immediately? Use this guide for Hotfixes!

Some fixes will be needed due to the nature of Gitflow. You would have to do a 'hotfix' or something outside of the normal process, but it's simply part of our normal process. 

#### Step 1 

- :fire: To implement an urgent change, a Hotfix branch is created off the `develop` branch to test and implement the fix.

#### Step 2

- :dancer: Once it’s complete, the Hotfix is merged with the `develop` branch.

### Issue flow
Find issues to work on <a href="https://github.com/orgs/ita-social-projects/projects/21" target="_blank">*here*</a>.

---

## Team

<div align="center">

***Project manager***

[![@IrynaZavushchak](https://avatars.githubusercontent.com/u/45690640?s=100&v=4)](https://github.com/IrynaZavushchak) 

***Tech expert***

[![@LanchevychMaxym](https://avatars.githubusercontent.com/u/47561209?s=100&v=4)](https://github.com/LanchevychMaxym) 

***Business analyst***

[![@vladnvp](https://avatars.githubusercontent.com/u/112704799?s=100&v=4)](https://github.com/vladnvp)

***Dev team***

[![@PingvinAustr](https://avatars.githubusercontent.com/u/94307620?size=100&v=4)](https://github.com/PingvinAustr) [![@EyR1oN](https://avatars.githubusercontent.com/u/91558615?s=100&v=4)](https://github.com/EyR1oN) [![@Tatiana2424](https://avatars.githubusercontent.com/u/92846322?s=100&v=4)](https://github.com/Tatiana2424) [![@AleXLaeR](https://avatars.githubusercontent.com/u/99609396?s=100&v=4)](https://github.com/AleXLaeR) [![@dimasster](https://avatars.githubusercontent.com/u/65833018?s=100&v=4)](https://github.com/dimasster) [![@grygorenkod](https://avatars.githubusercontent.com/u/113851742?s=100&v=4)](https://github.com/grygorenkod) [![@valllentine](https://avatars.githubusercontent.com/u/90246019?s=100&v=4)](https://github.com/valllentine)

[![@Kotusyk](https://avatars.githubusercontent.com/u/72945528?s=100&v=4)](https://github.com/Kotusyk) 
[![@Kasterov](https://avatars.githubusercontent.com/u/96317477?s=100&v=4)](https://github.com/Kasterov)
[![@Katerix](https://avatars.githubusercontent.com/u/92515141?s=100&v=4)](https://github.com/Katerix)
[![@Tysyatsky](https://avatars.githubusercontent.com/u/77460353?s=100&v=4)](https://github.com/Tysyatsky)
[![@MementoMorj](https://avatars.githubusercontent.com/u/98163405?s=100&v=4)](https://github.com/MementoMorj)
[![@Chynchenko](https://i.ibb.co/LP9n7w3/Svetlana.jpg)](https://github.com/Chynchenko)
[![@NadiaKishchuk](https://i.ibb.co/s3kgMSM/Nadia.jpg)](https://github.com/NadiaKishchuk)

[![@Dobriyr](https://avatars.githubusercontent.com/u/67451349?s=100&v=4)](https://github.com/Dobriyr)
[![@DanyilTerentiev](https://avatars.githubusercontent.com/u/96494594?s=100&v=4)](https://github.com/DanyilTerentiev)
[![@ValDekh](https://avatars.githubusercontent.com/u/61435019?s=100&v=4)](https://github.com/ValDekh)
[![@ormykhalyshyn](https://avatars.githubusercontent.com/u/92263517?s=100&v=4)](https://github.com/ormykhalyshyn)
[![@MaksBrat](https://avatars.githubusercontent.com/u/113379463?s=100&v=4)](https://github.com/MaksBrat)
[![@Lolimkeri](https://avatars.githubusercontent.com/u/57957843?s=100&v=4)](https://github.com/Lolimkeri)

</div>

---

## FAQ

- **Project falls after *npm start* command?**
    - Try to install exactly the same version of NodeJS specified in the requirements (16.0.0)

---

## Support

Reach out to us at one of the following places!

- Telegram at <a href="https://t.me/ira_zavushchak" target="_blank">`Iryna Zavushchak`</a>

---

## About Us

Visit our <a href="https://streetcode.com.ua" target="_blank">*site*</a>, we will be happy for everyone!

---

## License

- **[MIT license](http://opensource.org/licenses/mit-license.php)**
- Copyright 2022 © <a href="https://softserve.academy/" target="_blank"> SoftServe IT Academy</a>.
