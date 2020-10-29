class user():
    def __init__(self, id = 0, name="", email="", level=""):
        self.id = id
        self.name = name
        self.email = email
        self.level = level

    def serialize(self):
        return {
            'id': self.id,
            'name': self.name,
            'email':self.email,
            'level':self.level
        }
    @classmethod
    def deserialize(cls, dict):
        return user(dict['id'], dict['name'], dict['email'], dict['level'])
