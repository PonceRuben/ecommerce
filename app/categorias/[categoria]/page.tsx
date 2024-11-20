

export default async function Categoria({
    params,
}: {
    params: Promise<{ categoria: string}>;
}) {
    const categoria = (await params).categoria;
    return <div>Viendo {categoria}</div>;
}