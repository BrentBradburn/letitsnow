# My WebXR Development Environment

<!--
- https://stackoverflow.com/questions/72578214/how-to-style-a-mermaid-subgraphs-title
- https://fontawesome.com/v6/search?o=r&m=free
-->

<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css">

```mermaid
graph TD;

    subgraph layout["Code Editor"]
        direction LR
        copilot["<a href='https://github.com/features/copilot'<i class='fas fa-robot'></i> Copilot</a>"]
        vscode["<a href='https://code.visualstudio.com/'<i class='fas fa-code'></i> Visual Studio Code</a>"]
    end

    github["<a href='https://github.com/'><i class='fab fa-github'></i> GitHub</a>"]
    githubpages["<a href='https://pages.github.com/'><i class='fab fa-github'></i> GitHub Pages</a>"]

    vscode --> container
    mycode --> github --> githubpages --> headset
    mycode --> server
    server --> headset
    server --> browser

    subgraph container["<i class='fab fa-docker'></i> Docker '<a href='https://code.visualstudio.com/docs/devcontainers/containers'>Dev Container</a>'"]
        subgraph devcontainer[" "]
            style devcontainer color: lightblue;
            mycode["<i class='fas fa-file-code'></i> My App Source Code"]
            style mycode font-weight: bold, color: lightgreen;
            npm["<a href='https://en.wikipedia.org/wiki/Npm'><i class='fab fa-npm'></i> NPM</a>"]
            server["<a href='https://www.npmjs.com/package/http-server'><i class='fas fa-server'></i> HTTPS-Server</a>"]
            mycode --> npm --> server
        end
    end

    subgraph headset["<i class='fas fa-vr-cardboard'></i> VR Device"]
        subgraph myapp["<i class='fas fa-archway'></i> My Application"]
            style myapp color: orange;
            aframe["<a href='https://aframe.io/'><i class='fas fa-cube'></i> A-Frame</a>"]
        end
        myapp --> webxr["<a href='https://immersiveweb.dev/'><i class='fas fa-vr-cardboard'></i> WebXR</a>"]
    end

    subgraph browser["<i class='fab fa-chrome'></i> Chrome"]
        subgraph myapp2["<i class='fas fa-archway'></i> My Application"]
            style myapp2 color: orange;
            aframe2["<a href='https://aframe.io/'><i class='fas fa-cube'></i> A-Frame</a>"]
        end
        myapp2 --> webgl["<a href='https://www.khronos.org/webgl/'<i class='fas fa-cube'></i> WebGL</a>"]
    end
