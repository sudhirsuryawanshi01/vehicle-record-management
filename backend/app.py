from flask import Flask, render_template, request, jsonify, session, redirect
from supabase import create_client
import os
from flask_cors import CORS   # 🔥 ADD
SUPABASE_URL = os.getenv("SUPABASE_URL") 
SUPABASE_KEY = os.getenv("SUPABASE_KEY") 
app = Flask(__name__)
app.secret_key = "secret123"

# 🔥 CORS enable (IMPORTANT for Vercel)
CORS(app)

# Supabase connect
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

# ---------------- HOME ----------------

@app.route('/')
def home():
    return render_template('login.html')


# ---------------- LLR DASHBOARD ----------------

@app.route('/dashboard')
def dashboard():
    if 'user' not in session:
        return redirect('/')
    return render_template('dashboard.html')


# ---------------- RC DASHBOARD ----------------

@app.route('/rc')
def rc_dashboard():
    if 'user' not in session:
        return redirect('/')
    return render_template('rc_dashboard.html')


# ---------------- LOGIN ----------------

@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')

        res = supabase.table("users") \
            .select("*") \
            .eq("username", username) \
            .eq("password", password) \
            .execute()

        if res.data:
            session['user'] = username
            return jsonify({"success": True})

        return jsonify({"success": False})

    except Exception as e:
        print("LOGIN ERROR:", e)
        return jsonify({"success": False})


# ---------------- LOGOUT ----------------

@app.route('/logout')
def logout():
    session.clear()
    return redirect('/')


# =====================================================
# 🔵 LLR APIs
# =====================================================

@app.route('/add-data', methods=['POST'])
def add_data():
    try:
        if 'user' not in session:
            return jsonify({"error": "Unauthorized"}), 401

        data = request.json

        for key in data:
            if isinstance(data[key], str):
                data[key] = data[key].upper()

        supabase.table("llr_records").insert(data).execute()

        return jsonify({"success": True})

    except Exception as e:
        print("ADD ERROR:", e)
        return jsonify({"error": str(e)}), 500


@app.route('/get-data')
def get_data():
    if 'user' not in session:
        return jsonify([])

    res = supabase.table("llr_records") \
        .select("*") \
        .order("id", desc=True) \
        .execute()

    return jsonify(res.data)


@app.route('/update/<int:id>', methods=['PUT'])
def update_data(id):
    try:
        if 'user' not in session:
            return jsonify({"error": "Unauthorized"}), 401

        data = request.json

        for key in data:
            if isinstance(data[key], str):
                data[key] = data[key].upper()

        supabase.table("llr_records") \
            .update(data) \
            .eq("id", id) \
            .execute()

        return jsonify({"success": True})

    except Exception as e:
        print("UPDATE ERROR:", e)
        return jsonify({"error": str(e)}), 500


@app.route('/delete/<int:id>', methods=['DELETE'])
def delete_data(id):
    try:
        if 'user' not in session:
            return jsonify({"error": "Unauthorized"}), 401

        supabase.table("llr_records").delete().eq("id", id).execute()

        return jsonify({"success": True})

    except Exception as e:
        print("DELETE ERROR:", e)
        return jsonify({"error": str(e)}), 500


# =====================================================
# 🟢 RC APIs
# =====================================================

@app.route('/add-rc', methods=['POST'])
def add_rc():
    try:
        if 'user' not in session:
            return jsonify({"error": "Unauthorized"}), 401

        data = request.json

        for key in data:
            if isinstance(data[key], str):
                data[key] = data[key].upper()

        supabase.table("rc_records").insert(data).execute()

        return jsonify({"success": True})

    except Exception as e:
        print("RC ADD ERROR:", e)
        return jsonify({"error": str(e)}), 500


@app.route('/update-rc/<int:id>', methods=['PUT'])
def update_rc(id):
    data = request.json
    supabase.table("rc_records").update(data).eq("id", id).execute()
    return jsonify({"success": True})


@app.route('/delete-rc/<int:id>', methods=['DELETE'])
def delete_rc(id):
    supabase.table("rc_records").delete().eq("id", id).execute()
    return jsonify({"success": True})


@app.route('/get-data-rc')
def get_rc():
    if 'user' not in session:
        return jsonify([])

    res = supabase.table("rc_records") \
        .select("*") \
        .order("id", desc=True) \
        .execute()

    return jsonify(res.data)


# =====================================================
# 🔒 CACHE CONTROL
# =====================================================

@app.after_request
def add_header(response):
    response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
    response.headers["Pragma"] = "no-cache"
    response.headers["Expires"] = "0"
    return response


# =====================================================
# RUN
# =====================================================

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
