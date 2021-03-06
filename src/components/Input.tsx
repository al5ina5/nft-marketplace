import classNames from 'classnames'

export default function Input(props) {
    const { label, disabled, className } = props
    return (
        <div className={classNames(disabled && 'cursor-not-allowed')}>
            {label && <p className="mb-1 text-xs">{label}</p>}
            <input {...props} className={classNames('w-full bg-zinc-400 text-zinc-900 p-2', disabled && 'opacity-50 pointer-events-none', className)} />
        </div>
    )
}
