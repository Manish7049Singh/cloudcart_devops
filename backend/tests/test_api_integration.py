"""
Integration Test Suite for FastAPI E-Commerce Application.
Tests public, authenticated customer, and administrative API endpoints.
"""

import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.db.database import SessionLocal, Base, engine
from app.models.models import User, Category, Product

@pytest.fixture(scope="module")
def client():
    with TestClient(app) as test_client:
        yield test_client

def test_public_categories_list(client):
    response = client.get("/categories/")
    assert response.status_code == 200
    data = response.json()
    assert "data" in data
    assert isinstance(data["data"], list)

def test_public_products_list(client):
    response = client.get("/products/")
    assert response.status_code == 200
    data = response.json()
    assert "data" in data
    assert isinstance(data["data"], list)

def test_auth_workflow_and_protected_account(client):
    username = f"autotest_{int(pytest.importorskip('time').time())}"
    email = f"{username}@example.com"
    password = "TestPassword123!"

    # 1. Signup
    signup_res = client.post("/auth/signup", json={
        "full_name": "Automated Tester",
        "username": username,
        "email": email,
        "password": password
    })
    assert signup_res.status_code == 200
    assert signup_res.json()["data"]["username"] == username

    # 2. Login
    login_res = client.post("/auth/login", data={
        "username": username,
        "password": password
    })
    assert login_res.status_code == 200
    tokens = login_res.json()
    assert "access_token" in tokens
    assert "refresh_token" in tokens
    token = tokens["access_token"]
    refresh_token = tokens["refresh_token"]

    # 3. Protected GET /me/
    auth_header = {"Authorization": f"Bearer {token}"}
    me_res = client.get("/me/", headers=auth_header)
    assert me_res.status_code == 200
    assert me_res.json()["data"]["username"] == username

    # 4. Protected PUT /me/
    update_res = client.put("/me/", headers=auth_header, json={
        "username": username,
        "email": f"updated_{email}",
        "full_name": "Updated Automated Tester"
    })
    assert update_res.status_code == 200
    assert update_res.json()["data"]["full_name"] == "Updated Automated Tester"

    # 5. Token Refresh
    refresh_res = client.post("/auth/refresh", headers={"refresh-token": refresh_token})
    assert refresh_res.status_code == 200
    assert "access_token" in refresh_res.json()

def test_unauthenticated_protected_route_rejection(client):
    res = client.get("/me/")
    assert res.status_code == 403 or res.status_code == 401

def test_admin_role_authorization_enforcement(client):
    # Standard customer trying admin endpoint should receive 403 Forbidden
    username = f"cust_{int(pytest.importorskip('time').time())}"
    client.post("/auth/signup", json={
        "full_name": "Standard Customer",
        "username": username,
        "email": f"{username}@example.com",
        "password": "Password123!"
    })
    login_res = client.post("/auth/login", data={"username": username, "password": "Password123!"})
    token = login_res.json()["access_token"]

    # Attempt to create category as regular user
    forbidden_res = client.post("/categories/", headers={"Authorization": f"Bearer {token}"}, json={"name": "Hacked Category"})
    assert forbidden_res.status_code == 403
