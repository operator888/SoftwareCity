// Rust: struct, impl, trait, generics, Result.
pub struct Cache {
    data: std::collections::HashMap<String, String>,
}

impl Cache {
    pub fn new() -> Self {
        Self { data: std::collections::HashMap::new() }
    }

    pub fn get(&self, key: &str) -> Option<&String> {
        self.data.get(key)
    }

    pub fn set(&mut self, key: String, value: String) {
        self.data.insert(key, value);
    }
}

pub trait Store {
    fn get(&self, key: &str) -> Option<&String>;
    fn set(&mut self, key: String, value: String);
}

impl Store for Cache {
    fn get(&self, key: &str) -> Option<&String> { self.data.get(key) }
    fn set(&mut self, key: String, value: String) { self.data.insert(key, value); }
}

pub fn run(c: &mut dyn Store) -> Result<(), String> {
    c.set("k".to_string(), "v".to_string());
    Ok(())
}
