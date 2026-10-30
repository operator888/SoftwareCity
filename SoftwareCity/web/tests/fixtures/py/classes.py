# A Python file with class, inheritance, methods, recursion, data flow.
from typing import List

class Shape:
    def area(self) -> float:
        return 0.0

class Square(Shape):
    def __init__(self, side: float):
        self.side = side

    def area(self) -> float:
        return self.side * self.side

def factorial(n: int) -> int:
    if n <= 1:
        return 1
    return n * factorial(n - 1)

def sum_list(items: List[int]) -> int:
    total = 0
    for x in items:
        total += x
    return total

s = Square(5)
result = s.area()
print(factorial(5), sum_list([1, 2, 3]))
