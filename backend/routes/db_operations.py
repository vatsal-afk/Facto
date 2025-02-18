from datetime import datetime
from bson.objectid import ObjectId

class TranscriptionOperations:
    def __init__(self, db_connection):
        self.db = db_connection.db
        self.collection = self.db['transcriptions']

    def save_transcription(self, content):
        """
        Save transcription content to MongoDB
        Returns: document_id (str)
        """
        try:
            document = {
                'content': content,
                'timestamp': datetime.utcnow()
            }
            result = self.collection.insert_one(document)
            return str(result.inserted_id)
        except Exception as e:
            print(f"Error saving transcription: {str(e)}")
            raise

    def get_transcription(self, document_id):
        """
        Retrieve specific transcription by ID
        Returns: content (str) or None
        """
        try:
            document = self.collection.find_one({'_id': ObjectId(document_id)})
            return document['content'] if document else None
        except Exception as e:
            print(f"Error retrieving transcription: {str(e)}")
            raise

    def get_latest_transcription(self):
        """
        Retrieve the most recent transcription
        Returns: content (str) or None
        """
        try:
            document = self.collection.find_one(sort=[('timestamp', -1)])
            return document['content'] if document else None
        except Exception as e:
            print(f"Error retrieving latest transcription: {str(e)}")
            raise
                
    def delete_transcription(self, document_id):
        """
        Delete a transcription by ID
        Returns: True if successful, False otherwise
        """
        try:
            result = self.collection.delete_one({'_id': ObjectId(document_id)})
            return result.deleted_count > 0
        except Exception as e:
            print(f"Error deleting transcription: {str(e)}")
            raise