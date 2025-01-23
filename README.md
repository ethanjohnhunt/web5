My creative web feature will be a multi-listing management software for individuals. The primary platforms will be eBay and Facebook Marketplace, to track managed goods. The Technology stack I will use is MERN - MongoDB for the Database, Express Server, React Front-end and Node backend External API calls will be made to each platform to publish the listings and delist them, OAuth verification. Within my own Database, I will hold user detail information as well as listing information which will be used to automate the process The focus Audience for the service is specifically individuals who resell on the platforms previously mentioned, selling goods such as clothes, electronics or collectables. Furthermore my site aims to extend individuals reach, save them time and make managing multiple listings on several sites simpler and more automated.


I've uploaded two seperate folders of API tests: the first success was within the sandbox, the Second was an attempt at registering OAuth however, was unsuccessful, perhaps it was because of the Code, perhaps it was a security issue as I was using local host Use node server/index to run these experiments.

The third push was the front-end; I will need to update a lot here - I need to make the application so it is running from a server and not just front-end - currently to start navigate to SRC and use the command npm start The next front-end practical tasks would be inputting the iconography for the users so that on a listing, when it is created the user can click and edit, view messages or see where the item is listed. I imagine: 1 Text Box image to view the contacts from listings, One (i) for information if the user wishes to edit its description, and then iconography for what platforms it is listed on.




Moreover, 1 this gives rise for more API calls to my own database on whether the user has registered for the platform. 2 it also gives rise to keep the positions and styles of the image boxes on the screen. 3 User Information Password, Email etc...


I have successfully integrated eBay OAuth into the application, enabling seamless authentication and communication with eBay's API. Additionally, I have implemented Cloudinary to handle image storage, ensuring that images are securely uploaded, stored, and easily accessible.

Next Steps:
1. Front-End Styling and Development
Refine the user interface to enhance the overall user experience.
Ensure the layout is responsive and mobile-friendly.
Add visual elements such as buttons, icons, and transitions for a polished appearance.
Implement necessary forms and input validations for user interaction.
Enhance accessibility by following best practices (e.g., ARIA roles, keyboard navigation).
2. eBay Seller's Listing Integration
Fetch and display the user's active eBay listings using the eBay API.
Ensure listings are presented in an intuitive and user-friendly format (e.g., sortable table or gallery view).
If time permits, add functionality to create new eBay listings directly through the application.
3. Backend Logic
Storing eBay OAuth Token:
Implement secure backend logic to save and manage eBay OAuth tokens.
Ensure that tokens are encrypted and stored in compliance with eBay's security guidelines.
Handle token refresh workflows to maintain uninterrupted access to eBay's API.
Storing User Item Information:
Create backend logic to store information when a user creates a new item for listing.
Include fields such as item name, description, price, category, and associated image URLs from Cloudinary.
Ensure data validation and normalization before saving to the database.
