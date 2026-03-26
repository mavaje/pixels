<!-- Improved compatibility of back to top link: See: https://github.com/othneildrew/Best-README-Template/pull/73 -->
<a id="readme-top"></a>
<!--
*** Thanks for checking out the Best-README-Template. If you have a suggestion
*** that would make this better, please fork the repo and create a pull request
*** or simply open an issue with the tag "enhancement".
*** Don't forget to give the project a star!
*** Thanks again! Now go create something AMAZING! :D
-->

<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]



<!-- PROJECT LOGO -->
<br />
<div align="center">
  <a href="https://github.com/mavaje/pixels">
    <img src="images/icon.svg" alt="Logo" width="80" height="80">
  </a>

<h3 align="center">PIXELS</h3>

  <p align="center">
    A manifestation of an idea of a free-for-all infinite pixel art canvas.
    <br />
    <a href="https://mavaje.github.io/pixels/"><strong>Visit the site</strong></a>
  </p>
</div>



<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li><a href="#usage">Usage</a></li>
    <li><a href="#contributing">Contrubuting</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

<p>
  Not much to say about it, except to try it out!
</p>

<p>
  I wanted to instill the same vibe as a vanilla Minecraft world; chaos around the spawn, and overconfident safety further out.
</p>

<p>
  This project was also an outlet for me to try my hand at designing a fully functional, though minimal, web app.
</p>

<p>
  Some of the challenges worked through:

  <ul>
    <li>Keeping the interface intuitive, simple, and elegant, all at the same time. Also keeping in mind platform independence.</li>
    <li>Event handling - specifically hotkeys and multi-touch controls</li>
  </ul>
</p>

<p align="right">(<a href="#readme-top">back to top</a>)</p>



### Built With

* ![npm]
* ![Firebase]

Mostly vanilla TS.

Only three npm packages:

<ul>
  <li>Typescript, for type safety and IDE completion</li>
  <li>ESBuild to wrap up all my Typescript</li>
  <li>Firebase for the storage for pixel data, mostly out of familiarity.</li>
</ul>

This README is also using [https://github.com/othneildrew/Best-README-Template]



<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- USAGE EXAMPLES -->
## Usage

To play, just go to the GitHub page ([https://mavaje.github.io/pixels/])

Choose one of the three tools; Move, Draw, or Picker.

### Move

To move with the move tool, just click and drag around the canvas.
You can hold `space` to move with another tool selected.
Scrolling also works, as does multi-touch for touchscreen devices.

#### Zoom

Zoom in/out by holding `ctrl` (or `command` on MacOS) and scrolling.
On touchscreen, just pinch to zoom.

### Draw

Just click to draw! You can also assign a different colour to the Left, Right, and Middle mouse buttons.

### Picker

Essentially the inverse of drawing, it takes the colour of the pixel the cursor is on and assigns it to the respective button.

You can also refine the colours by clicking the colour dots.



<p align="right">(<a href="#readme-top">back to top</a>)</p>



<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
Don't forget to give the project a star! Thanks again!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Top contributors:

<a href="https://github.com/mavaje/pixels/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=mavaje/pixels" alt="contrib.rocks image" />
</a>



<!-- CONTACT -->
## Contact

Matthew Jensen - matthewjensen77@gmail.com

Project Link: [https://github.com/mavaje/pixels](https://github.com/mavaje/pixels)

<p align="right">(<a href="#readme-top">back to top</a>)</p>




<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/mavaje/pixels.svg?style=for-the-badge
[contributors-url]: https://github.com/mavaje/pixels/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/mavaje/pixels.svg?style=for-the-badge
[forks-url]: https://github.com/mavaje/pixels/network/members
[stars-shield]: https://img.shields.io/github/stars/mavaje/pixels.svg?style=for-the-badge
[stars-url]: https://github.com/mavaje/pixels/stargazers
[issues-shield]: https://img.shields.io/github/issues/mavaje/pixels.svg?style=for-the-badge
[issues-url]: https://github.com/mavaje/pixels/issues
<!-- Shields.io badges. You can a comprehensive list with many more badges at: https://github.com/inttter/md-badges -->
[npm]: https://img.shields.io/badge/npm-CB3837?logo=npm&logoColor=fff
[Firebase]: https://img.shields.io/badge/Firebase-039BE5?logo=Firebase&logoColor=white
