import { useState, useEffect } from 'react';
import axios from 'axios';

function AddKeywordForm() {
    const [keyword, setKeyword] = useState('');
    const [answers, setAnswers] = useState(['', '', '', '']);
    const [undefinedKeywords, setUndefinedKeywords] = useState([]);
    const [selectedUndefinedKeyword, setSelectedUndefinedKeyword] = useState(null);

    // Fetch undefined keywords on component mount
    useEffect(() => {
        fetchUndefinedKeywords();
        
        // Auto-refresh every 3 seconds
        const interval = setInterval(fetchUndefinedKeywords, 3000);
        
        return () => clearInterval(interval);
    }, []);

    const fetchUndefinedKeywords = async () => {
        try {
            const response = await axios.get('http://localhost:8000/api/undefined-keywords.php');
            if (response.data.success) {
                setUndefinedKeywords(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching undefined keywords:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/undefined-keywords.php', {
                action: 'define_keyword',
                keywordId: selectedUndefinedKeyword ? selectedUndefinedKeyword.id : null,
                keyword: selectedUndefinedKeyword ? null : keyword,
                answers: answers.filter(ans => ans.trim() !== '')
            });
            
            if (response.data.success) {
                alert('Keyword added successfully');
                setKeyword('');
                setAnswers(['', '', '', '']);
                setSelectedUndefinedKeyword(null);
                fetchUndefinedKeywords(); // Refresh the list
            } else {
                alert('Error: ' + response.data.message);
            }
        } catch (error) {
            console.error('Error adding keyword:', error);
            alert('Error adding keyword: ' + (error.response?.data?.message || error.message));
        }
    };

    const handleUndefinedKeywordSelect = (undefinedKeyword) => {
        setSelectedUndefinedKeyword(undefinedKeyword);
        setKeyword(undefinedKeyword.keyword);
    };

    const deleteUndefinedKeyword = async (keywordId) => {
        try {
            await axios.delete(`http://localhost:8000/api/undefined-keywords.php?id=${keywordId}`);
            alert('Undefined keyword deleted successfully');
            fetchUndefinedKeywords(); // Refresh the list
        } catch (error) {
            console.error('Error deleting undefined keyword:', error);
            alert('Error deleting undefined keyword');
        }
    };

    return (
        <div style={{ display: 'flex', gap: '20px' }}>
            {/* Undefined Keywords List */}
            <div style={{ flex: 1 }}>
                <h3>Undefined Keywords ({undefinedKeywords.length})</h3>
                <p style={{ fontSize: '12px', color: '#666', marginBottom: '10px' }}>
                    Auto-refreshes every 3 seconds
                </p>
                <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px' }}>
                    {undefinedKeywords.map((item) => (
                        <div key={item.id} style={{ 
                            padding: '10px', 
                            border: '1px solid #eee', 
                            marginBottom: '10px',
                            backgroundColor: selectedUndefinedKeyword?.id === item.id ? '#e3f2fd' : 'white'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <strong>{item.keyword}</strong>
                                    <div style={{ fontSize: '12px', color: '#666' }}>
                                        Searched {item.frequency} time(s)
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#666' }}>
                                        Added: {new Date(item.created_at).toLocaleDateString()}
                                    </div>
                                </div>
                                <div>
                                    <button 
                                        onClick={() => handleUndefinedKeywordSelect(item)}
                                        style={{ 
                                            marginRight: '5px', 
                                            padding: '5px 10px', 
                                            backgroundColor: '#4CAF50', 
                                            color: 'white', 
                                            border: 'none', 
                                            borderRadius: '3px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Add Response
                                    </button>
                                    <button 
                                        onClick={() => deleteUndefinedKeyword(item.id)}
                                        style={{ 
                                            padding: '5px 10px', 
                                            backgroundColor: '#f44336', 
                                            color: 'white', 
                                            border: 'none', 
                                            borderRadius: '3px',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {undefinedKeywords.length === 0 && (
                        <p style={{ textAlign: 'center', color: '#666' }}>No undefined keywords found</p>
                    )}
                </div>
            </div>

            {/* Add Keyword Form */}
            <div style={{ flex: 1 }}>
                <h3>Add Keyword Response</h3>
                <form onSubmit={handleSubmit}>
                    <input 
                        type="text" 
                        placeholder="Keyword" 
                        value={keyword} 
                        onChange={e => setKeyword(e.target.value)} 
                        required 
                        style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ccc' }}
                    />

                    {answers.map((ans, index) => (
                        <input
                            key={index}
                            type="text"
                            placeholder={`Answer ${index + 1}`}
                            value={ans}
                            onChange={e => {
                                const newAnswers = [...answers];
                                newAnswers[index] = e.target.value;
                                setAnswers(newAnswers);
                            }}
                            style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ccc' }}
                        />
                    ))}

                    <button 
                        type="submit" 
                        style={{ 
                            width: '100%', 
                            padding: '10px', 
                            backgroundColor: '#2196F3', 
                            color: 'white', 
                            border: 'none', 
                            borderRadius: '3px',
                            cursor: 'pointer'
                        }}
                    >
                        Add Keyword Response
                    </button>
                </form>
            </div>
        </div>
    );
}

export default AddKeywordForm;