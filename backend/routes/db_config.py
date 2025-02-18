from pymongo import MongoClient
from dotenv import load_dotenv
import os
from datetime import datetime

# Load environment variables
load_dotenv()

class MongoDBConnection:
    _instance = None
    _client = None
    _db = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def __init__(self):
        if MongoDBConnection._client is None:
            mongodb_uri = os.getenv("MONGODB_URI")
            if not mongodb_uri:
                raise ValueError("MongoDB URI not found in environment variables")
            
            try:
                # Connect to MongoDB
                MongoDBConnection._client = MongoClient(mongodb_uri)
                
                # Create or get the database
                MongoDBConnection._db = self._client['news_verification']
                
                # Create or get the collections
                self.create_collections()
                
                # Optional: Create indexes
                self.create_indexes()
                
                print("MongoDB connection established successfully")
                
                # Verify connection
                self._client.admin.command('ping')
                print("Pinged your deployment. Connection successful!")
                
            except Exception as e:
                print(f"Error connecting to MongoDB: {str(e)}")
                raise

    def create_collections(self):
        """Create collections if they don't exist"""
        db = MongoDBConnection._db
        
        # List of collections to create
        collections = ['transcriptions']
        
        # Get existing collections
        existing_collections = db.list_collection_names()
        
        # Create collections if they don't exist
        for collection in collections:
            if collection not in existing_collections:
                db.create_collection(collection)
                print(f"Created collection: {collection}")

    def create_indexes(self):
        """Create indexes for better query performance"""
        # Create timestamp index for transcriptions collection
        transcriptions = MongoDBConnection._db.transcriptions
        transcriptions.create_index([("timestamp", -1)])
        print("Created indexes successfully")

    @property
    def db(self):
        return MongoDBConnection._db

    @property
    def client(self):
        return MongoDBConnection._client

    def close_connection(self):
        if MongoDBConnection._client:
            MongoDBConnection._client.close()
            MongoDBConnection._client = None
            MongoDBConnection._db = None
            print("MongoDB connection closed")