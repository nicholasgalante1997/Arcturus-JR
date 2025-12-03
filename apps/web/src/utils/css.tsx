export function toLinkMarkup(href: string) {
    return (
        <> 
            <link rel="preload" as="style" href={href} precedence="high" />
            <link rel="stylesheet" href={href} precedence="high" />
        </>
    );
}