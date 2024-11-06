# DSR_POPULATOR_AUTOMATION

This is an automation script written in node.js specifically designed for automating daily sales report for amazon brands and populating the gross units sale based on the dates of the input files by mapping on the ASIN's

#IMPORTANT INITIAL STEPS

Make sure Node is installed in your system. To install, go to this link - https://nodejs.org/en/download/prebuilt-installer
Download the installer and install node.js.

#Steps

1. Clone the repository (To clone go to a code editor or cmd and type git clone abd the url) or directly download in zip format
![image](https://github.com/user-attachments/assets/79cad651-f5c0-4cc5-954e-09a837939a8b)
After that go to the cloned directory and type command in code editor or cmd -> npm install
2. Cretae a folder named input_files in the same directory
3. Paste all the daily_orders files for a particular brand
4. Run the index.js using the command -> "node index.js" (without the quotes)...run in CLI or any editor
5. get the result in the same directory named updated_output.csv
6. The base.csv is completely customizable based on your brand's ASIN's

#Notes

1. Please make sure you have node installed on your pc
2. If you want to rerun this again just delete the previous files from the input_files folder and copy paste the new files/file and then rerun the script
   This is because the date filter is still not working perfectly and it will get duplicated. It will be developed soon.

#Important

This is still in development. If you encounter any bug or issue with this script. Please feel free to email me or raise an issue.
If you want to collab on this please contact me on my email address ronweasly9435@gmail.com. I will send you an invite
