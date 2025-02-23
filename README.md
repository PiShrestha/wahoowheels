# wahoowheels
A web-based ride-sharing platform enabling users to request rides to their destinations.

How to run:
Anything in quotes ("") is a command prompt
1) Clone the repository
2) "cd backend"
3) "python3 -m venv env"
4) "source env/bin/activate"
5) "pip install -r requirements.txt" (this will install all the requirements needed to run the program)
6) "cd ../frontend"
7) "npm install axios react-router-dom jwt-decode"
8) "npm install bootstrap react-bootstrap"
9) npm install axios js-cookie
10) Create a .env file with the following variable: VITE_API_URL="http://localhost:8000"
11) Go to mapbox.com and create an account
12) Them you get a public api token then in in your frontend/.env: VITE_MAPBOX_TOKEN=<your_public_key>
13) Create two seperate terminal/Command Lines
14) Change one terminal into the backend directory (make sure you are in your virtual envirroment, if not then refer to instruction 4)
15) "python manage.py makemigrations api"
16) "python manage.py migrate"
17) "python manage.py runserver"
18) In the other terminal change into the frontend directory
19) "npm run dev"
20) Go to the webiste that this command provides, then that should be the page

Thank you for following along with the complicated instructions. We hope you enjoy our product
