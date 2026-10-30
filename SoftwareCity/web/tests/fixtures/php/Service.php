// PHP: class with brace on next line
<?php
namespace App;

class UserService
{
    private array $users = [];

    public function add(string $name): void
    {
        $this->users[] = $name;
    }

    public function find(string $name): ?string
    {
        foreach ($this->users as $u) {
            if ($u === $name) return $u;
        }
        return null;
    }
}

class AdminService extends UserService
{
    public function all(): array
    {
        return $this->users;
    }
}
