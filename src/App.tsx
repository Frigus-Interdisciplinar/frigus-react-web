import { useEffect, useState } from "react";
import { api } from "@/utils/api.util";

// apenas para teste da funcao, sera removido

type Response = {
  id: number,
  title: string,
  price: number,
  description: string,
  category: string,
  image: string,
  rating: {rate: number, count: number }, 
}

const App = () => {
  const [data, setData] = useState<Response[]>([])

  useEffect(() => {
    const loadData = async () => {
      const res = await api<Response[]>("/products", "GET");
      setData(res);
    }
    loadData();
  })

  return <div className="bg-[#2e2e2e]">
    <ul>
      {data && data.map((product) => (
        <li key={product.id}>{product.title}</li>
      ))}
    </ul>
    
  </div>;
};

export default App;
