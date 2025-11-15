🥕 E-Faring Portal – Online Vegetable Market

**E-Faring Portal** is a digital marketplace platform designed to connect farmers and consumers for the direct sale of vegetables and other farm produce. 
This web application aims to eliminate middlemen, ensure fair pricing, and make fresh produce easily accessible to buyers.

📌 Features

- 🛒 **Product Listings**: View a catalog of fresh vegetables available for purchase.
- 🧑‍🌾 **Farmer Portal**: Allows farmers to add and manage their own products.
- 💳 **Cart & Checkout**: Buyers can add items to their cart and simulate order placement.
- 📱 **Responsive Design**: Accessible via desktop and mobile devices.
- 🔐 **Basic User Login**: Enables user sessions for both buyers and farmers.

🛠️ Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Java (Servlets & JSP)
- **Database**: MySQL
- **Server**: Apache Tomcat

  
🚀 Getting Started

1. **Clone the Repository**
   git clone https://github.com/ParinitaMalisetty/E-Farming-Portal.git
2. **For Execution**

   Run the `frontend/index.html` file

Backend (Django + DRF)

1. Create and activate venv
   - Windows PowerShell:
     - `python -m venv .venv`
     - `.venv\Scripts\Activate.ps1`
2. Install dependencies
   - `pip install -r requirements.txt` or `pip install Django djangorestframework django-cors-headers`
3. Run migrations
   - `python manage.py migrate`
4. Start server
   - `python manage.py runserver`
5. API endpoints
   - `GET /api/products/`
   - `GET /api/orders/`
   - `GET /api/reviews/`

