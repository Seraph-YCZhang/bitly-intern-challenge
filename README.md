##README
    This is a Node.js app with Express framework.

###Steps for install
1. Download and install Node.js from https://nodejs.org/en/
2. Unzip the compressed file
3. Using command enter the directory of the submitted files
4. Enter the command below:
    ```npm install```
5. After install all the needed packages, enter:
    ```node index.js```
6. Open the browser and enter:
    ```127.0.0.1/8000```
    The json returned by the program will display on the screen.

###Solution
Get the three differnent json from   
    https://api-ssl.bitly.com/v4/user ,  
    https://api-ssl.bitly.com/v4/groups/{group_guid}/bitlinks,  
    https://api-ssl.bitly.com/v4/bitlinks/{bitlink}/countries 

These three api provides guid, bitlinks of this guid, and clicks per country of one bitlink.

What we need is the average number of clicks, per country, within the last 30 days, for the Bitlinks in a user's default group. So after I got some data from the three api above, I made an Array to store the avgerage clicks with the country value. For each link, if the value of cpuntry is the same, its clicks will be added and averaged into the original one. Or it is not the same, a new object will be pushed into the array. Form these data into a json type and res.send it.
