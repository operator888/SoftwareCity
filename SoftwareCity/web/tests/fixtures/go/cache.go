# Go: methods with receivers, struct, interface.
package store

import "fmt"

type Cache struct {
    data map[string]int
}

func NewCache() *Cache {
    return &Cache{data: make(map[string]int)}
}

func (c *Cache) Get(key string) (int, bool) {
    v, ok := c.data[key]
    return v, ok
}

func (c *Cache) Set(key string, val int) {
    c.data[key] = val
}

type Counter interface {
    Get(key string) (int, bool)
    Set(key string, val int)
}

func Use(c Counter) {
    c.Set("a", 1)
    fmt.Println(c.Get("a"))
}
