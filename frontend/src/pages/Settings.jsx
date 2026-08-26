import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Settings() {
    const { user, updateProfile } = useAuth();
    const navigate = useNavigate();

    // Extract street address and pincode from user.address if available
    const initialAddress = user?.address || '';
    let initialPincode = '';
    let initialStreet = initialAddress;

    if (initialAddress.includes('Pincode:')) {
        const parts = initialAddress.split('Pincode:');
        initialStreet = parts[0].replace(/,$/, '').trim();
        initialPincode = parts[1] ? parts[1].trim() : '';
    } else {
        const pinMatch = initialAddress.match(/\b\d{6}\b/);
        if (pinMatch) {
            initialPincode = pinMatch[0];
            initialStreet = initialAddress.replace(pinMatch[0], '').replace(/,$/, '').trim();
        }
    }

    const [form, setForm] = useState({
        name: user?.name || '',
        phone: user?.phone || '',
        streetAddress: initialStreet || '',
        pincode: initialPincode || ''
    });
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');
    const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else if (user.role === 'owner' || user.role === 'admin') {
            navigate('/owner');
        } else {
            const addr = user.address || '';
            let pin = '';
            let street = addr;
            if (addr.includes('Pincode:')) {
                const parts = addr.split('Pincode:');
                street = parts[0].replace(/,$/, '').trim();
                pin = parts[1] ? parts[1].trim() : '';
            } else {
                const pinMatch = addr.match(/\b\d{6}\b/);
                if (pinMatch) {
                    pin = pinMatch[0];
                    street = addr.replace(pinMatch[0], '').replace(/,$/, '').trim();
                }
            }

            setForm({
                name: user.name || '',
                phone: user.phone || '',
                streetAddress: street || '',
                pincode: pin || ''
            });
        }
    }, [user, navigate]);

    const isFullyConfigured =
        form.name.trim().length >= 2 &&
        /^[0-9]{10}$/.test((form.phone || '').trim()) &&
        form.streetAddress.trim().length >= 5 &&
        /^[0-9]{6}$/.test((form.pincode || '').trim());

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg('');
        setSuccessMsg('');

        // Strict Validations for Name, Phone, Address, and Pincode
        if (!form.name.trim() || form.name.trim().length < 2) {
            setErrorMsg('⚠️ Full Name is required (minimum 2 characters).');
            return;
        }

        const phoneClean = (form.phone || '').trim();
        if (!/^[0-9]{10}$/.test(phoneClean)) {
            setErrorMsg('⚠️ Mobile Number must be a valid 10-digit phone number (e.g. 9876543210).');
            return;
        }

        if (!form.streetAddress.trim() || form.streetAddress.trim().length < 5) {
            setErrorMsg('⚠️ Please enter a complete delivery address (Door No, Street Name, Area/City).');
            return;
        }

        const pincodeClean = (form.pincode || '').trim();
        if (!/^[0-9]{6}$/.test(pincodeClean)) {
            setErrorMsg('⚠️ Pincode must be a valid 6-digit number (e.g. 600001).');
            return;
        }

        const fullFormattedAddress = `${form.streetAddress.trim()}, Pincode: ${pincodeClean}`;

        setLoading(true);
        try {
            await updateProfile({
                name: form.name.trim(),
                phone: phoneClean,
                address: fullFormattedAddress
            });
            setSuccessMsg('✓ Account Settings & Delivery Address saved successfully! Your profile is 100% complete.');
        } catch (err) {
            setErrorMsg(err.response?.data?.message || 'Failed to update settings. Please check all fields.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="settings-page" style={{ padding: '40px 20px', background: '#f8fafc', minHeight: '80vh' }}>
            <div className="container" style={{ maxWidth: '650px', margin: '0 auto' }}>
                <div style={{ background: '#ffffff', padding: '32px', borderRadius: '16px', boxShadow: '0 8px 24px rgba(0,0,0,0.06)', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <div>
                            <h1 style={{ margin: 0, fontSize: '26px', color: '#0f172a' }}>⚙️ User Account Settings</h1>
                            <p style={{ margin: '4px 0 0', color: '#64748b', fontSize: '14px' }}>
                                Manage your profile and required delivery details
                            </p>
                        </div>
                        <span style={{
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            background: user?.role === 'owner' ? '#7c3aed' : user?.role === 'admin' ? '#059669' : '#1a56db',
                            color: '#fff'
                        }}>
                            {user?.role}
                        </span>
                    </div>

                    {/* Address & Profile Status Banner */}
                    <div style={{
                        padding: '16px',
                        borderRadius: '12px',
                        marginBottom: '24px',
                        background: isFullyConfigured ? '#f0fdf4' : '#fef2f2',
                        border: isFullyConfigured ? '1px solid #bbf7d0' : '1px solid #fecaca',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <div style={{ fontSize: '28px' }}>{isFullyConfigured ? '✅' : '⚠️'}</div>
                        <div>
                            <div style={{ fontWeight: '700', color: isFullyConfigured ? '#166534' : '#991b1b', fontSize: '15px' }}>
                                {isFullyConfigured ? 'Account Profile & Address Fully Configured' : 'Incomplete Account Details!'}
                            </div>
                            <div style={{ fontSize: '13px', color: isFullyConfigured ? '#15803d' : '#b91c1c', marginTop: '2px' }}>
                                {isFullyConfigured
                                    ? 'All required details (Name, 10-Digit Mobile, Address & 6-Digit Pincode) are saved. You can proceed with ordering.'
                                    : 'IMPORTANT: You must fill out your Full Name, 10-digit Mobile Number, Delivery Address, and 6-digit Pincode below.'}
                            </div>
                        </div>
                    </div>

                    {successMsg && (
                        <div className="alert alert-success" style={{ marginBottom: '20px', background: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0', padding: '14px', borderRadius: '8px' }}>
                            {successMsg}
                            <div style={{ marginTop: '10px' }}>
                                <Link to="/checkout" className="btn btn-sm btn-primary" style={{ fontWeight: '600' }}>
                                    Proceed to Checkout →
                                </Link>
                            </div>
                        </div>
                    )}

                    {errorMsg && (
                        <div className="alert alert-error" style={{ marginBottom: '20px', background: '#fee2e2', color: '#b91c1c', border: '1px solid #fecaca', padding: '14px', borderRadius: '8px', fontWeight: '700' }}>
                            {errorMsg}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group" style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '700', color: '#334155' }}>Email Address (Read-only)</label>
                            <input
                                type="email"
                                className="form-control"
                                value={user?.email || ''}
                                disabled
                                style={{ background: '#f1f5f9', cursor: 'not-allowed', color: '#64748b', border: '1px solid #cbd5e1', padding: '10px', width: '100%', borderRadius: '8px' }}
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '700', color: '#0f172a' }}>
                                Full Name <span style={{ color: '#dc2626' }}>*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                className="form-control"
                                placeholder="Enter your full name"
                                value={form.name}
                                onChange={handleChange}
                                style={{ border: !form.name.trim() ? '2px solid #f87171' : '1px solid #cbd5e1', padding: '10px', width: '100%', borderRadius: '8px' }}
                                required
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '700', color: '#0f172a' }}>
                                Mobile Number (10-Digits) <span style={{ color: '#dc2626' }}>*</span>
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                className="form-control"
                                placeholder="e.g. 9876543210"
                                value={form.phone}
                                onChange={handleChange}
                                maxLength={10}
                                style={{ border: !/^[0-9]{10}$/.test((form.phone || '').trim()) ? '2px solid #f87171' : '1px solid #cbd5e1', padding: '10px', width: '100%', borderRadius: '8px' }}
                                required
                            />
                        </div>

                        <div className="form-group" style={{ marginBottom: '16px' }}>
                            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '700', color: '#0f172a' }}>
                                Delivery Street Address / Door No <span style={{ color: '#dc2626' }}>*</span>
                            </label>
                            <textarea
                                name="streetAddress"
                                className="form-control"
                                placeholder="Enter Door No, Street Name, Area & City..."
                                value={form.streetAddress}
                                onChange={handleChange}
                                rows="3"
                                style={{ border: form.streetAddress.trim().length < 5 ? '2px solid #f87171' : '1px solid #cbd5e1', padding: '10px', width: '100%', borderRadius: '8px' }}
                                required
                            ></textarea>
                        </div>

                        <div className="form-group" style={{ marginBottom: '24px' }}>
                            <label style={{ display: 'block', marginBottom: '6px', fontWeight: '700', color: '#0f172a' }}>
                                Pincode (6-Digits) <span style={{ color: '#dc2626' }}>*</span>
                            </label>
                            <input
                                type="text"
                                name="pincode"
                                className="form-control"
                                placeholder="e.g. 600001"
                                value={form.pincode}
                                onChange={handleChange}
                                maxLength={6}
                                style={{ border: !/^[0-9]{6}$/.test((form.pincode || '').trim()) ? '2px solid #f87171' : '1px solid #cbd5e1', padding: '10px', width: '100%', borderRadius: '8px' }}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary btn-block"
                            disabled={loading}
                            style={{ padding: '14px', fontSize: '16px', fontWeight: '700', borderRadius: '8px', width: '100%', background: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer' }}
                        >
                            {loading ? 'Saving Settings...' : '💾 Save Settings & Address'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Settings;
