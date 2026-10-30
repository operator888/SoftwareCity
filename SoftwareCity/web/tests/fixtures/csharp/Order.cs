// C#: class with constructor, properties, inheritance, generic method, record.
public class OrderProcessor
{
    private readonly ILogger log;

    public OrderProcessor(ILogger log) { this.log = log; }

    public Order Process(Order order)
    {
        if (order.Items.Count == 0)
        {
            log.Warn("empty order");
            return order;
        }
        log.Info($"processing {order.Id}");
        order.Total = order.Items.Sum(i => i.Price);
        return order;
    }

    public T FindById<T>(long id) where T : class
    {
        return null;
    }
}

public record Order(long Id, List<Item> Items)
{
    public decimal Total { get; set; }
}

public record Item(string Name, decimal Price);

public interface ILogger { void Info(string msg); void Warn(string msg); }
