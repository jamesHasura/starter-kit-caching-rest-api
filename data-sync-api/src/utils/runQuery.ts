import fetch from "cross-fetch"

export async function runQuery(
    query: string,
    variables: Record<string, any>,
): Promise<Record<string, any>> {
    const request = await fetch(process.env.HASURA_GRAPHQL_API as string, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Hasura-Admin-Secret": process.env
                .HASURA_GRAPHQL_ADMIN_SECRET as string,
        },
        body: JSON.stringify({ query, variables }),
    })
    return request.json()
}
