# BookingCare - Medical Appointment Booking App

This is a React app for booking medical appontments, users can view information about doctors and hospitals that match their criteria as well as geographical location.

![alt text](https://raw.githubusercontent.com/VanKhang99/bookingCare-host-images/main/Readme%20file/UI.png)

## `Getting Started`

1. Install Node.js (Version 14) on your local machine.
2. Install PostgreSQL on your local machine.
3. Clone the repository to your local machine.
4. Clone the repository Backend to your local machine
    - Link repo: https://github.com/VanKhang99/Back-End-BookingCare/tree/production (Choose branch production)
5. Run "npm install" to install all dependencies for both repos
6. Run "npm start" for both repos


## `Teachnology Used`
This app was built using the following technologies:

- FrontEnd
    - HTML
    - CSS (SASS, Antd, Bootstrap)
    - ReactJS 
    - Redux-toolkit
    - Redux-thunk
- BackEnd 
    - NodeJS (ExpressJS)
    - Sequelize (ORM)
- Database
    - SQL (PostgreSQL)

## `Features`
1. Users can book an appointment with the appropriate doctors, the medical examination packages are suitable for themselves. After booking, you will be notified by email

![alt text](https://raw.githubusercontent.com/VanKhang99/bookingCare-host-images/main/Readme%20file/Booking.png)
![alt text](https://raw.githubusercontent.com/VanKhang99/bookingCare-host-images/main/Readme%20file/Booking-2.png)

2. Users can filter doctors and packages by 4 criteria: 
    - City
    - Category
    - Price
    - Hospital
    
 ![alt text](https://raw.githubusercontent.com/VanKhang99/bookingCare-host-images/main/Readme%20file/Filter.png)

3. Web have admin page, doctor page and personal page
    - Admin page: responsible for CRUD examination packages, CRUD accounts for doctors, modifying information about doctors as well as medical examination packages, ....
    ![alt text](https://raw.githubusercontent.com/VanKhang99/bookingCare-host-images/main/Readme%20file/admin-page.png)
    
    - Doctor page: can see the number of people who book an appointment in the next days, create or delete a medical appointment that suits your time.
    ![alt text](https://raw.githubusercontent.com/VanKhang99/bookingCare-host-images/main/Readme%20file/doctor-page.png)
    
    - Personal page: can view appointment history
    ![alt text](https://raw.githubusercontent.com/VanKhang99/bookingCare-host-images/main/Readme%20file/personal-page.png)

4. User can create an account, and login by GmaiL - Facebook, update account information, change password, change picture, view appointment history

![alt text](https://raw.githubusercontent.com/VanKhang99/bookingCare-host-images/main/Readme%20file/Login-page.png)

5. Scheduled appointment times will be updated in real time

6. Possible to change the website language, but there are still many limitations

## `Update in the future`
- Responsive website compatible with many different screens
- Packages of surgery, medical tests
- Medical products
- Simulate online payment function

## `Try account admin`
- email: admin@bookingcare.io
- password: 123456
