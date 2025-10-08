#!/bin/bash
# Install Java 17 for N8ture AI App Development
# Run this script with: bash INSTALL_JAVA.sh

set -e

echo "========================================="
echo "N8ture AI App - Java 17 Installation"
echo "========================================="
echo ""

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    SUDO=""
else
    SUDO="sudo"
fi

# Detect OS
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$NAME
    VER=$VERSION_ID
else
    echo "Cannot detect OS. Please install Java 17 manually."
    exit 1
fi

echo "Detected OS: $OS"
echo ""

# Install based on OS
if [[ "$OS" == *"Ubuntu"* ]] || [[ "$OS" == *"Debian"* ]]; then
    echo "Installing OpenJDK 17 via apt..."
    echo ""

    $SUDO apt update
    $SUDO apt install -y openjdk-17-jdk

elif [[ "$OS" == *"CentOS"* ]] || [[ "$OS" == *"Red Hat"* ]]; then
    echo "Installing OpenJDK 17 via yum..."
    echo ""

    $SUDO yum install -y java-17-openjdk-devel

elif [[ "$OS" == *"Fedora"* ]]; then
    echo "Installing OpenJDK 17 via dnf..."
    echo ""

    $SUDO dnf install -y java-17-openjdk-devel

else
    echo "Unsupported OS: $OS"
    echo "Please install Java 17 manually from:"
    echo "https://www.oracle.com/java/technologies/downloads/#java17"
    exit 1
fi

echo ""
echo "========================================="
echo "Verifying Java installation..."
echo "========================================="
echo ""

java -version

echo ""
echo "========================================="
echo "Setting JAVA_HOME..."
echo "========================================="
echo ""

# Find Java home
if [ -d "/usr/lib/jvm/java-17-openjdk-amd64" ]; then
    JAVA_HOME_PATH="/usr/lib/jvm/java-17-openjdk-amd64"
elif [ -d "/usr/lib/jvm/java-17-openjdk" ]; then
    JAVA_HOME_PATH="/usr/lib/jvm/java-17-openjdk"
elif [ -d "/usr/lib/jvm/jre-17-openjdk" ]; then
    JAVA_HOME_PATH="/usr/lib/jvm/jre-17-openjdk"
else
    # Try to find it
    JAVA_HOME_PATH=$(dirname $(dirname $(readlink -f $(which java))))
fi

echo "Java installed at: $JAVA_HOME_PATH"

# Add to bashrc if not already there
if ! grep -q "JAVA_HOME" ~/.bashrc; then
    echo "" >> ~/.bashrc
    echo "# Java 17 for N8ture AI App" >> ~/.bashrc
    echo "export JAVA_HOME=$JAVA_HOME_PATH" >> ~/.bashrc
    echo "export PATH=\$PATH:\$JAVA_HOME/bin" >> ~/.bashrc
    echo ""
    echo "Added JAVA_HOME to ~/.bashrc"
fi

export JAVA_HOME=$JAVA_HOME_PATH
export PATH=$PATH:$JAVA_HOME/bin

echo ""
echo "========================================="
echo "✅ Java 17 Installation Complete!"
echo "========================================="
echo ""
echo "Java Version:"
java -version
echo ""
echo "JAVA_HOME: $JAVA_HOME"
echo ""
echo "Next steps:"
echo "1. Run: source ~/.bashrc"
echo "2. Navigate to: cd '/home/ubuntu-server/dev/WalkersApp/Walker App/KAppMakerExtended-main'"
echo "3. Build app: ./gradlew :composeApp:assembleDebug"
echo ""
