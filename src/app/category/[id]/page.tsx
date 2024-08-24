import CategoryItems from "../../components/CategoryItems";

export default function CategoryPage({ params }: { params: { id: string } }) {
  return <CategoryItems id={params.id} />;
}
