import { useRef, useState } from 'react'
import Layout from '../components/Layout'
import Logo from '../assets/logo'

function Vocabulary() {
    const [words, setWords] = useState([])
    const [loading, setLoading] = useState(false)
    const [topic, setTopic] = useState('Transportation')

    // Stores an error message if vocabulary generation fails
    const [error, setError] = useState('')

    // Reference to the vocabulary section that will be printed
    const printRef = useRef(null)

    // Calls the backend and loads vocabulary words
    const loadVocabulary = async () => {
        try {
            // Show loading state
            setLoading(true)

            // Clear any previous error message
            setError('')

            const response = await fetch(
                'http://127.0.0.1:8000/api/vocabulary',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        topic
                    })
                }
            )

            // Stop and show an error when the backend request fails
            if (!response.ok) {
                throw new Error('Vocabulary request failed')
            }

            const data = await response.json()

            // Save the generated vocabulary words
            setWords(data.words)

        } catch (error) {
            console.error(error)

            // Show an error message on the screen
            setError('Failed to generate vocabulary. Please try again.')

        } finally {
            // Always stop loading
            setLoading(false)
        }
    }

    // Opens the browser print dialog
    const handlePrint = () => {
        window.print()
    }

    return (
        <Layout>
            <div
                ref={printRef}
                className="print-area mx-auto max-w-4xl px-6 py-8"
            >
                {/* Shown only on the printed vocabulary worksheet */}
                <div className="print-only">
                    <div className="print-header">

                        <div className="print-brand">
                            <Logo size={32} />
                            <span>BridgeVoice</span>
                        </div>

                        <h1>Daily Vocabulary Worksheet</h1>

                        <div className="print-details">
                            <p>
                                <strong>Topic:</strong> {topic}
                            </p>

                            <p>
                                <strong>Date:</strong>{' '}
                                {new Date().toLocaleDateString()}
                            </p>
                        </div>

                    </div>
                </div>

                {/* Normal website header—not included in printing */}
                <div className="screen-only mb-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        📚 Daily Vocabulary
                    </h2>

                    <p className="mt-1 text-gray-600 dark:text-gray-400">
                        Learn useful English words and improve your confidence every day.
                    </p>
                </div>

                {/* Shows an error message if vocabulary generation fails */}
                {error && (
                    <div className="screen-only mt-6 rounded-xl border border-red-300 bg-red-50 p-4 dark:border-red-700 dark:bg-red-900/30">
                        <p className="text-red-700 dark:text-red-400">
                            {error}
                        </p>
                    </div>
                )}

                {/* Topic controls—not included in printing */}
                <div className="screen-only rounded-2xl border border-gray-200 bg-white p-6 shadow-md dark:border-gray-800 dark:bg-gray-900">

                    <h2 className="mb-2 text-xl font-semibold text-purple-700 dark:text-purple-400">
                        Today's Topic
                    </h2>

                    <select
                        value={topic}
                        onChange={(event) => {
                            // Update the selected topic
                            setTopic(event.target.value)

                            // Clear vocabulary generated for the previous topic
                            setWords([])

                            // Clear any previous error message
                            setError('')
                        }}
                        className="mt-2 w-full rounded-xl border border-gray-300 bg-white p-3 text-gray-900 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                    >
                        <option value="Transportation">Transportation</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Banking">Banking</option>
                        <option value="Job Interview">Job Interview</option>
                        <option value="Restaurant">Restaurant</option>
                        <option value="Shopping">Shopping</option>
                    </select>

                    <div className="mt-5 flex flex-wrap gap-3">

                        {/* Generate vocabulary button */}
                        <button
                            onClick={loadVocabulary}
                            disabled={loading}
                            className="rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 px-6 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-purple-500/30 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
                        >
                            {loading
                                ? 'Generating...'
                                : "Generate Today's Words"}
                        </button>

                        {/* Print vocabulary button */}
                        <button
                            onClick={handlePrint}
                            disabled={words.length === 0}
                            className="rounded-xl border border-gray-300 bg-white px-6 py-3 font-semibold text-gray-800 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700"
                        >
                            🖨️ Print Vocabulary
                        </button>

                    </div>
                </div>

                {/* Empty-state message—not included in printing */}
                {words.length === 0 && !loading && !error && (
                    <div className="screen-only py-12 text-center">

                        <p className="mb-4 text-6xl">
                            📚
                        </p>

                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                            Ready to Learn?
                        </h3>

                        <p className="mt-2 text-gray-600 dark:text-gray-400">
                            Choose a topic and generate five new English words for today.
                        </p>

                    </div>
                )}

                {/* Vocabulary cards shown on screen and in print */}
                <div className="print-vocabulary-grid mt-6 grid gap-4 md:grid-cols-2">
                    {words.map((item, index) => (
                        <div
                            key={index}
                            className="print-vocabulary-card rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-900"
                        >
                            <h3 className="text-2xl font-bold text-purple-700 dark:text-purple-400">
                                {item.word}
                            </h3>

                            <p className="mt-4 text-gray-700 dark:text-gray-300">
                                <span className="font-semibold text-gray-900 dark:text-white">
                                    Meaning:
                                </span>{' '}
                                {item.meaning}
                            </p>

                            <p className="mt-3 italic text-gray-600 dark:text-gray-400">
                                <span className="font-semibold not-italic text-gray-900 dark:text-white">
                                    Example:
                                </span>{' '}
                                "{item.example}"
                            </p>
                        </div>
                    ))}
                </div>

            </div>
        </Layout>
    )
}

export default Vocabulary