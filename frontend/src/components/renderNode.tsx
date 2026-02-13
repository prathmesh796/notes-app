import { type JSX } from "react";

export function renderNode(
    node: any,
    path: number[],
    updateNode: (path: number[], newValue: string) => void
) {
    switch (node.type) {
        case "heading":
            const Tag = `h${node.depth}` as keyof JSX.IntrinsicElements;
            return (
                <Tag>
                    {node.children?.map((child: any, i: number) => (
                        <span key={i}>
                            {renderNode(child, [...path, i], updateNode)}
                        </span>
                    ))}
                </Tag>
            );

        case "paragraph":
            return (
                <p>
                    {node.children?.map((child: any, i: number) => (
                        <span key={i}>
                            {renderNode(child, [...path, i], updateNode)}
                        </span>
                    ))}
                </p>
            );

        case "text":
            return (
                <span
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => {
                        const newValue = e.currentTarget.textContent || "";
                        if (newValue !== node.value) {
                            updateNode(path, newValue);
                        }
                    }}
                    style={{
                        display: "inline",
                        outline: "none"
                    }}
                >
                    {node.value}
                </span>
            );

        case "strong":
            return (
                <strong>
                    {node.children?.map((child: any, i: number) => (
                        <span key={i}>
                            {renderNode(child, [...path, i], updateNode)}
                        </span>
                    ))}
                </strong>
            );

        case "emphasis":
            return (
                <em>
                    {node.children?.map((child: any, i: number) => (
                        <span key={i}>
                            {renderNode(child, [...path, i], updateNode)}
                        </span>
                    ))}
                </em>
            );

        case "list":
            const ListTag = node.ordered ? "ol" : "ul";
            return (
                <ListTag>
                    {node.children?.map((child: any, i: number) => (
                        <span key={i}>
                            {renderNode(child, [...path, i], updateNode)}
                        </span>
                    ))}
                </ListTag>
            );

        case "listItem":
            return (
                <li>
                    {node.children?.map((child: any, i: number) => (
                        <span key={i}>
                            {renderNode(child, [...path, i], updateNode)}
                        </span>
                    ))}
                </li>
            );

        case "code":
            return (
                <pre>
                    <code
                        contentEditable
                        suppressContentEditableWarning
                        onBlur={(e) => {
                            const newValue = e.currentTarget.textContent || "";
                            if (newValue !== node.value) {
                                updateNode(path, newValue);
                            }
                        }}
                        style={{ outline: "none" }}
                    >
                        {node.value}
                    </code>
                </pre>
            );

        case "inlineCode":
            return (
                <code
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => {
                        const newValue = e.currentTarget.textContent || "";
                        if (newValue !== node.value) {
                            updateNode(path, newValue);
                        }
                    }}
                    style={{ outline: "none" }}
                >
                    {node.value}
                </code>
            );

        case "link":
            return (
                <a href={node.url} title={node.title}>
                    {node.children?.map((child: any, i: number) => (
                        <span key={i}>
                            {renderNode(child, [...path, i], updateNode)}
                        </span>
                    ))}
                </a>
            );

        case "blockquote":
            return (
                <blockquote>
                    {node.children?.map((child: any, i: number) => (
                        <span key={i}>
                            {renderNode(child, [...path, i], updateNode)}
                        </span>
                    ))}
                </blockquote>
            );

        case "break":
            return <br />;

        default:
            console.warn(`Unhandled node type: ${node.type}`, node);
            return null;
    }
}