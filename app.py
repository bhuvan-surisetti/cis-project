import os
from flask import Flask, request, jsonify, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__, static_folder='frontend/dist', static_url_path='/')

# --- DATABASE CONFIG ---
# Use a local SQLite database file, stored relative to this file
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'apps_catalog.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# --- MODELS ---

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(50), nullable=False)
    department = db.Column(db.String(100), nullable=False)

    def to_dict(self):
        return {
            "id": self.id,
            "username": self.username,
            "role": self.role,
            "department": self.department
        }

class Application(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(150), nullable=False)
    version = db.Column(db.String(50), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    tags = db.Column(db.String(200), nullable=True)
    dependencies = db.Column(db.String(200), nullable=True)
    usage = db.Column(db.Integer, default=0)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "version": self.version,
            "category": self.category,
            "tags": self.tags,
            "dependencies": self.dependencies,
            "usage": self.usage
        }

# Database Initialization
with app.app_context():
    db.create_all()
    
    # Seed data if tables are empty
    if User.query.count() == 0:
        initial_users = [
            User(username="Admin SuperUser", role="admin", department="IT"),
            User(username="Alice (Security Eng)", role="user", department="Security"),
            User(username="Bob (Data Scientist)", role="user", department="Analytics")
        ]
        db.session.bulk_save_objects(initial_users)
        
    if Application.query.count() == 0:
        initial_apps = [
            Application(name="CodeEditor", version="1.2", category="Development", tags="ide, coding", dependencies="Java", usage=150),
            Application(name="SecureVault", version="3.0", category="Security", tags="password, encryption", dependencies="None", usage=300),
            Application(name="DataAnalyzer", version="2.1", category="Analytics", tags="data, charts", dependencies="Python", usage=80),
            Application(name="FirewallPro", version="1.0", category="Security", tags="network, protection", dependencies="None", usage=450),
            Application(name="CloudDB Manager", version="4.2", category="IT", tags="database, admin", dependencies="PostgreSQL", usage=500)
        ]
        db.session.bulk_save_objects(initial_apps)
        
    db.session.commit()


@app.route('/')
def index():
    return app.send_static_file('index.html')

@app.errorhandler(404)
def not_found(e):
    return app.send_static_file('index.html')

# --- USERS API ---
@app.route('/api/users', methods=['GET'])
def get_users():
    users = User.query.all()
    return jsonify([user.to_dict() for user in users])

# --- APP CRUD API ---
@app.route('/api/apps', methods=['GET'])
def get_apps():
    search = request.args.get('search', '').lower()
    if search:
        # Search by name or tags
        apps = Application.query.filter(
            db.or_(
                Application.name.ilike(f'%{search}%'),
                Application.tags.ilike(f'%{search}%')
            )
        ).all()
        return jsonify([app.to_dict() for app in apps])
    
    apps = Application.query.all()
    return jsonify([app.to_dict() for app in apps])

@app.route('/api/apps', methods=['POST'])
def add_app():
    data = request.json
    new_app = Application(
        name=data.get('name', ''),
        version=data.get('version', '1.0'),
        category=data.get('category', 'General'),
        tags=data.get('tags', ''),
        dependencies=data.get('dependencies', ''),
        usage=0
    )
    db.session.add(new_app)
    db.session.commit()
    return jsonify({"status": "success"})

@app.route('/api/apps/<int:app_id>', methods=['PUT'])
def update_app(app_id):
    app_record = db.session.get(Application, app_id)
    if app_record:
        data = request.json
        if 'name' in data:
            app_record.name = data['name']
        if 'version' in data:
            app_record.version = data['version']
        if 'category' in data:
            app_record.category = data['category']
        if 'tags' in data:
            app_record.tags = data['tags']
        if 'dependencies' in data:
            app_record.dependencies = data['dependencies']
        
        db.session.commit()
        return jsonify({"status": "success"})
    return jsonify({"error": "App not found"}), 404

@app.route('/api/apps/<int:app_id>', methods=['DELETE'])
def delete_app(app_id):
    app_record = db.session.get(Application, app_id)
    if app_record:
        db.session.delete(app_record)
        db.session.commit()
        return jsonify({"status": "success"})
    return jsonify({"error": "App not found"}), 404

# --- ANALYTICS & RECOMMENDATIONS ---
@app.route('/api/analytics')
def get_analytics():
    top_apps = Application.query.order_by(Application.usage.desc()).limit(3).all()
    return jsonify([app.to_dict() for app in top_apps])

@app.route('/api/recommend')
def recommend_apps():
    user_id = int(request.args.get('user_id', 1))
    
    current_user = db.session.get(User, user_id)
    
    if not current_user:
        return jsonify([])

    department = current_user.department
    
    # Recommend apps from user's department
    recommended = Application.query.filter(Application.category.ilike(department)).order_by(Application.usage.desc()).all()
    
    if not recommended:
        # Fallback: Top apps generally
        recommended = Application.query.order_by(Application.usage.desc()).limit(2).all()
    else:
        # Check if we have 2, else take top from other limits too?
        # Following original logic: sort by usage, take top 2 docs
        pass
        
    return jsonify({
        "department": department,
        "apps": [app.to_dict() for app in recommended[:2]]
    })

if __name__ == '__main__':
    app.run(debug=True)