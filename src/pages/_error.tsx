function Error({ statusCode }) {
    return (
        <p>
            {statusCode
                ? `An error ${statusCode} occurred on server`
                : 'An error occurred on client'}
        </p>
    )
}


export default function FiveHundred({ statusCode }) {
    return <div className="p-6 py-12 max-w-7xl mx-auto space-y-12 w-full">
        <div className="p-12 space-y-6 text-center">
            <p className="font-extended text-4xl uppercase">{statusCode || 'Oops!'}</p>
            <p>
                {statusCode
                    ? `Opps. An error (${statusCode}) occurred on server. Try again in like 2 minutes, or report to an admin.`
                    : 'Oops. An error occurred on the client. Try again in like 2 minutes, or report to an admin.'}
            </p>
        </div>
    </div>
}
Error.getInitialProps = ({ res, err }) => {
    const statusCode = res ? res.statusCode : err ? err.statusCode : 404
    return { statusCode }
}
