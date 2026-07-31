import { useState } from 'react'
import { API_BASE } from '../../config'

function ChangeEmailModal({ isOpen, onClose }) {
    const [newEmail, setNewEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    const handleChangeEmail = async () => {
        setError('')
        setSuccess(false)

        if (!newEmail.trim()) {
            setError('Please enter a new email')
            return
        }

        setLoading(true)

        try {
            const currentEmail = localStorage.getItem('email')

            const response = await fetch(
                `${API_BASE}/api/users/change-email`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        current_email: currentEmail,
                        new_email: newEmail,
                    }),
                }
            )

            const data = await response.json()

            if (response.ok) {
                setSuccess(true)
                localStorage.setItem('email', newEmail)
                setNewEmail('')

                setTimeout(() => {
                    setSuccess(false)
                    onClose()
                }, 1500)
            } else {
                setError(data.detail || 'Unable to change email')
            }
        } catch {
            setError('Cannot connect to server.')
        }

        setLoading(false)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#1a1f2e] rounded-xl p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold text-white mb-4">
                    Change Email
                </h2>

                {error && (
                    <div className="mb-4 rounded-lg border border-red-500 bg-red-900/30 px-3 py-2 text-sm text-red-300">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 rounded-lg border border-green-500 bg-green-900/30 px-3 py-2 text-sm text-green-300">
                        Email updated successfully!
                    </div>
                )}

                <input
                    type="email"
                    placeholder="Enter your new email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full p-3 rounded-lg bg-[#2a3147] text-white border border-gray-600 mb-4"
                />

                <div className="flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 rounded-lg bg-gray-600 text-white"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleChangeEmail}
                        disabled={loading}
                        className="px-4 py-2 rounded-lg bg-purple-600 text-white disabled:opacity-50"
                    >
                        {loading ? 'Updating...' : 'Update Email'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ChangeEmailModal