View the [Github Gist here](https://gist.github.com/nicholasgalante1997/9c90874bdcaf5a8c86fcdc60b2d9ca5d).

> v1.0.0-rc.3
>
> Last updated 2025-11-09

This guide provides reproducible steps for setting up a consistent software developer environment across different Ubuntu 24.04 installation types. This guide elicits some of my preferences in an Ubuntu linux environment, but can be scaled up or down rather easily.

## Table of Contents

- [Section A: Fresh Ubuntu Install on Computer](#section-a-fresh-ubuntu-install-on-computer)
- [Section B: VirtualBox Ubuntu on Windows](#section-b-virtualbox-ubuntu-on-windows)
- [Section C: Ubuntu on Windows via WSL2](#section-c-ubuntu-on-windows-via-wsl2)
- [Section D: Omakub-based Setup](#section-d-omakub-based-setup)

---

## Section A: Fresh Ubuntu Install on Computer

### 1. System Update

```bash
sudo apt update && sudo apt upgrade -y
```

### 2. Install Essential Build Tools

```bash
sudo apt install -y build-essential curl wget git ssh libssl-dev pkg-config \
  ca-certificates gnupg lsb-release software-properties-common
```

### 3. Install ZSH and Oh My Zsh

```bash
# Install ZSH
sudo apt install -y zsh

# Set ZSH as default shell
chsh -s $(which zsh)

# Install Oh My Zsh
sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

### 4. Install Mise

[Mise Documentation](https://mise.jdx.dev/)

```bash
curl https://mise.run | sh
echo 'eval "$(~/.local/bin/mise activate zsh)"' >> ~/.zshrc
source ~/.zshrc
```

### 5. Install Programming Languages

#### Rust (Direct Install - NOT via Mise)

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source "$HOME/.cargo/env"
```

#### Go (via Mise)

```bash
mise use --global go@latest
```

#### Node.js (via Mise)

```bash
mise use --global node@lts
```

#### Bun (Direct Install - NOT via Mise)

```bash
curl -fsSL https://bun.sh/install | bash
```

#### Python (via Mise)

```bash
mise use --global python@latest
```

#### Additional Languages

```bash
# C/C++ (already installed via build-essential)

# C#
sudo apt install -y dotnet-sdk-8.0

# Zig
mise use --global zig@latest

# Elixir
mise use --global elixir@latest

# Java
mise use --global java@latest
```

### 6. Install Docker

```bash
# Add Docker's official GPG key
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# Add repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Add user to docker group
sudo usermod -aG docker $USER
newgrp docker
```

### 7. Install Podman

```bash
sudo apt install -y podman
```

### 8. Database Setup via Docker/Podman

Databases are primarily run as containers. Here are example commands:

#### PostgreSQL Container

```bash
docker run -d \
  --name postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  postgres:latest
```

#### SQLite Container

```bash
docker run -d \
  --name sqlite \
  -v sqlite_data:/data \
  nouchka/sqlite3:latest
```

#### Neo4j Container

```bash
docker run -d \
  --name neo4j \
  -p 7474:7474 -p 7687:7687 \
  -e NEO4J_AUTH=neo4j/password \
  -v neo4j_data:/data \
  neo4j:latest
```

**Note**: Replace `docker` with `podman` if using Podman.

### 9. Install Terminal Tools

#### Ghostty (with fallback)

```bash
# Try installing Ghostty
# Check https://ghostty.org for latest installation instructions
# If unavailable, use Alacritty as fallback:
# sudo apt install -y alacritty
```

#### Zellij

```bash
cargo install zellij
```

#### Neovim

```bash
mise use --global neovim@latest
# Using apt
# sudo apt install -y neovim
```

#### LazyVim

```bash
# Backup existing config
mv ~/.config/nvim ~/.config/nvim.bak 2>/dev/null
mv ~/.local/share/nvim ~/.local/share/nvim.bak 2>/dev/null

# Install LazyVim
git clone https://github.com/LazyVim/starter ~/.config/nvim
rm -rf ~/.config/nvim/.git
```

#### LazyDocker

```bash
curl https://raw.githubusercontent.com/jesseduffield/lazydocker/master/scripts/install_update_linux.sh | bash
```

### 10. Install AI Tools

#### Ollama

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

#### Amazon Q

```bash
# Install via npm
npm install -g @aws/amazon-q-developer-cli
```

### 11. Install Development Tools

#### GitHub CLI

```bash
sudo apt install -y gh
```

### 12. Install IDEs

#### VSCode

```bash
# Download from vendor
wget -O vscode.deb 'https://code.visualstudio.com/sha/download?build=stable&os=linux-deb-x64'
sudo dpkg -i vscode.deb
sudo apt install -f -y
rm vscode.deb
```

#### Zed

```bash
# Download from vendor
# TODO resolve issues with GPU renderer via vulkan installation 
curl -f https://zed.dev/install.sh | sh
```

### 13. Install Browsers

#### Brave

```bash
# Download from vendor
wget -O brave.deb 'https://laptop-updates.brave.com/latest/linux'
sudo dpkg -i brave.deb
sudo apt install -f -y
rm brave.deb
```

#### Firefox

```bash
# Download from vendor
wget -O firefox.tar.bz2 'https://download.mozilla.org/?product=firefox-latest&os=linux64&lang=en-US'
tar -xjf firefox.tar.bz2
sudo mv firefox /opt/
sudo ln -s /opt/firefox/firefox /usr/local/bin/firefox
rm firefox.tar.bz2
```

### 14. Install Design Tools

#### Figma

```bash
# Download from vendor
wget -O figma.AppImage 'https://desktop.figma.com/linux/Figma.AppImage'
chmod +x figma.AppImage
sudo mv figma.AppImage /opt/figma
sudo ln -s /opt/figma /usr/local/bin/figma
```

### 15. Configure Git

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
git config --global init.defaultBranch main
```

### 16. Reboot

```bash
sudo reboot
```

---

## Section B: VirtualBox Ubuntu on Windows

### Prerequisites on Windows Host

1. Download and install [VirtualBox](https://www.virtualbox.org/wiki/Downloads)
2. Download [Ubuntu 24.04 Desktop ISO](https://ubuntu.com/download/desktop)

### VirtualBox VM Setup

1. **Create New VM**
   - Name: Ubuntu-Dev
   - Type: Linux
   - Version: Ubuntu (64-bit)
   - Memory: 8192 MB (minimum, 16384 MB recommended)
   - Create virtual hard disk: VDI, Dynamically allocated, 50 GB minimum

2. **VM Settings**
   - System → Processor: 4 CPUs minimum
   - Display → Video Memory: 128 MB
   - Storage → Add Ubuntu ISO to optical drive
   - Network → Adapter 1: NAT or Bridged Adapter

3. **Install Ubuntu**
   - Start VM and follow Ubuntu installation wizard
   - Choose "Normal installation"
   - Install third-party software for graphics and Wi-Fi hardware

4. **Install VirtualBox Guest Additions**

```bash
sudo apt update
sudo apt install -y build-essential dkms linux-headers-$(uname -r)

# Insert Guest Additions CD from VirtualBox menu: Devices → Insert Guest Additions CD
sudo mount /dev/cdrom /mnt
sudo /mnt/VBoxLinuxAdditions.run
sudo reboot
```

5. **Enable Shared Clipboard and Drag-and-Drop**
   - VirtualBox menu: Devices → Shared Clipboard → Bidirectional
   - Devices → Drag and Drop → Bidirectional

### Continue with Section A Steps

After Guest Additions installation, follow all steps from [Section A](#section-a-fresh-ubuntu-install-on-computer) starting from step 1.

---

## Section C: Ubuntu on Windows via WSL2

### Prerequisites on Windows

1. **Enable WSL2**

Open PowerShell as Administrator:

```powershell
wsl --install
```

If WSL is already installed, ensure WSL2 is default:

```powershell
wsl --set-default-version 2
```

2. **Install Ubuntu 24.04**

```powershell
wsl --install -d Ubuntu-24.04
```

3. **Launch Ubuntu and Create User**

Launch "Ubuntu 24.04" from Start menu and create your user account.

### WSL-Specific Configuration

#### Enable systemd

```bash
sudo tee /etc/wsl.conf > /dev/null <<EOF
[boot]
systemd=true

[interop]
enabled=true
appendWindowsPath=true
EOF
```

Restart WSL from PowerShell:

```powershell
wsl --shutdown
```

Relaunch Ubuntu.

### Install Windows Terminal (Optional but Recommended)

From PowerShell:

```powershell
winget install Microsoft.WindowsTerminal
```

### Continue with Section A Steps

Follow all steps from [Section A](#section-a-fresh-ubuntu-install-on-computer) with these WSL-specific notes:

**Modifications for WSL:**

1. **Docker**: Use Docker Desktop for Windows with WSL2 backend instead of Docker CE:
   - Install [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/)
   - Enable WSL2 integration in Docker Desktop settings
   - Skip Docker installation steps from Section A

2. **Ghostty**: Not available on WSL. Use Windows Terminal instead.

3. **GUI Applications**: 
   - VSCode: Install on Windows and use WSL extension
   - Browsers: Use Windows versions
   - Figma: Use Windows version or web app

4. **Zed**: Install Windows version if available, or use VSCode

### VSCode WSL Integration

On Windows, install VSCode and the WSL extension:

```powershell
winget install Microsoft.VisualStudioCode
```

In VSCode, install the "WSL" extension. Then from Ubuntu terminal:

```bash
code .
```

This will connect VSCode on Windows to your WSL environment.

---

## Section D: Omakub-based Setup

[Omakub](https://omakub.org) is an opinionated Ubuntu 24.04 setup that includes many developer tools out of the box.

### 1. Install Omakub

```bash
wget -qO- https://omakub.org/install | bash
```

This will install:
- ZSH with Oh My Zsh
- Docker
- Neovim
- Various terminal tools
- And more...

### 2. Post-Omakub Customizations

After Omakub installation, add the following tools specific to your workflow:

#### Install Rust (NOT via Mise)

```bash
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source "$HOME/.cargo/env"
```

#### Install Languages via Mise

```bash
mise use --global go@latest
mise use --global node@lts
mise use --global python@latest
mise use --global zig@latest
mise use --global elixir@latest
mise use --global java@latest
```

#### Install Bun (NOT via Mise)

```bash
curl -fsSL https://bun.sh/install | bash
```

#### Install Podman

```bash
sudo apt install -y podman
```

#### Install Zellij

```bash
cargo install zellij
```

#### Install LazyVim

```bash
mv ~/.config/nvim ~/.config/nvim.bak 2>/dev/null
mv ~/.local/share/nvim ~/.local/share/nvim.bak 2>/dev/null
git clone https://github.com/LazyVim/starter ~/.config/nvim
rm -rf ~/.config/nvim/.git
```

#### Install LazyDocker

```bash
curl https://raw.githubusercontent.com/jesseduffield/lazydocker/master/scripts/install_update_linux.sh | bash
```

#### Install Ollama

```bash
curl -fsSL https://ollama.com/install.sh | sh
```

#### Install Amazon Q

```bash
npm install -g @aws/amazon-q-developer-cli
```

#### Install VSCode

```bash
wget -O vscode.deb 'https://code.visualstudio.com/sha/download?build=stable&os=linux-deb-x64'
sudo dpkg -i vscode.deb
sudo apt install -f -y
rm vscode.deb
```

#### Install Zed

```bash
curl -f https://zed.dev/install.sh | sh
```

#### Install Brave Browser

```bash
wget -O brave.deb 'https://laptop-updates.brave.com/latest/linux'
sudo dpkg -i brave.deb
sudo apt install -f -y
rm brave.deb
```

#### Install Figma

```bash
wget -O figma.AppImage 'https://desktop.figma.com/linux/Figma.AppImage'
chmod +x figma.AppImage
sudo mv figma.AppImage /opt/figma
sudo ln -s /opt/figma /usr/local/bin/figma
```

#### Install C# Support

```bash
sudo apt install -y dotnet-sdk-8.0
```

### 3. Setup Databases via Docker

Follow the same database container setup from [Section A, Step 8](#8-database-setup-via-dockerpodman).

### 4. Configure Git

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
git config --global init.defaultBranch main
```

### 5. Reboot

```bash
sudo reboot
```

---

## Post-Installation Verification

Run these commands to verify installations:

```bash
# Languages
rustc --version
go version
node --version
bun --version
python --version

# Tools
docker --version
podman --version
zellij --version
nvim --version
gh --version
ollama --version

# Databases (if running containers)
docker ps  # Check running containers
```

## Troubleshooting

### Mise not found after installation

```bash
export PATH="$HOME/.local/bin:$PATH"
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
```

### Docker permission denied

```bash
sudo usermod -aG docker $USER
newgrp docker
```

### WSL systemd not working

Ensure Windows version is 11 or Windows 10 with build 19041 or higher.

---

## Maintenance

### Update all Mise tools

```bash
mise upgrade
```

### Update Rust

```bash
rustup update
```

### Update system packages

```bash
sudo apt update && sudo apt upgrade -y
```

### Update Bun

```bash
bun upgrade
```

---
