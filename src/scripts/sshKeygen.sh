#!/bin/bash
# Script to generate an SSH key and add github.com to known hosts

# create temporary folders to store agent info and ssh keys
mkdir ./tmpKeys
mkdir ./tmpAgent

# generate public and private SSH keys with no password
ssh-keygen -t ed25519 -f ./tmpKeys/dockerKey -g -N ""

# add github.com to ssh known hosts so that we can ssh connect to github.com
#ssh-keyscan -H github.com -> ADD TO KNOWN HOSTS
ssh-keyscan -H github.com -y >> ~/.ssh/known_hosts

# start ssh agent 
# ssh-agent -s
eval $(ssh-agent -s)

# save ssh agent sock info and agent PID so that we can connect later
#single > - overwrites; >> - appends
#these env variables already exist after starting agent
echo $SSH_AUTH_SOCK > ./tmpAgent/agentSock
echo $SSH_AGENT_PID > ./tmpAgent/agentPID

# add ssh key to ssh agent
ssh-add ./tmpKeys/dockerKey
exit 0