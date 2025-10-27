
# Vibhasha - The Multilingual Playbook

Build using [Material for MkDocs](https://squidfunk.github.io/mkdocs-material/getting-started/)

# Setup Local Dev Environment
- Create python environment 
```bash
python3 -m venv venv-mkdocs
source venv-mkdocs/bin/activate
pip install -r requirements.txt
```

- For serving the docs in local server
```bash
cd MultilingualPlaybook 
mkdocs serve
```

# Deploy
- Build the static html files using following command
```bash
mkdocs build # generates static website inside the site/ directory (by default)
```
- You Can Host This Folder On, GitHub Pages (Add mkdocs gh-deploy (after configuring mkdocs.yml with your repo URL)) ; Azure Static Web Apps / Blob Storage, Your own web server (Nginx, Apache, etc.)

<!-- # Introduction 
TODO: Give a short introduction of your project. Let this section explain the objectives or the motivation behind this project. 

# Getting Started
TODO: Guide users through getting your code up and running on their own system. In this section you can talk about:
1.	Installation process
2.	Software dependencies
3.	Latest releases
4.	API references

# Build and Test
TODO: Describe and show how to build your code and run the tests. 

# Contribute
TODO: Explain how other users and developers can contribute to make your code better. 

If you want to learn more about creating good readme files then refer the following [guidelines](https://docs.microsoft.com/en-us/azure/devops/repos/git/create-a-readme?view=azure-devops). You can also seek inspiration from the below readme files:
- [ASP.NET Core](https://github.com/aspnet/Home)
- [Visual Studio Code](https://github.com/Microsoft/vscode)
- [Chakra Core](https://github.com/Microsoft/ChakraCore) -->