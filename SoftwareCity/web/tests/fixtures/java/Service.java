// Java: class with constructor, methods, fields, call resolution.
public class UserService {
    private final Database db;
    private final Logger log;

    public UserService(Database db, Logger log) {
        this.db = db;
        this.log = log;
    }

    public User findById(long id) {
        log.info("looking up user " + id);
        User u = db.query("SELECT * FROM users WHERE id = ?", id);
        return u;
    }

    public void save(User u) {
        if (u == null) throw new IllegalArgumentException("user required");
        db.execute("INSERT INTO users (name) VALUES (?)", u.name);
    }
}

class User { String name; long id; }
class Database {
    public User query(String sql, long id) { return new User(); }
    public void execute(String sql, String name) {}
}
class Logger { public void info(String msg) {} }
