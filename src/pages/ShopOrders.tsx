import React, { useState, useEffect } from 'react';
import { fetchShopOrders, deleteShopOrder } from '../services/api';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/AuthContext';
import "./styles/ShopOrders.css";
import Confirm from '../components/ui/Confirm';

const ShopOrders: React.FC = () => {
  const { showToast } = useToast();
  const { user } = useAuth();

  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchShopOrders(user?.email)
      .then((data: any) => setOrders(Array.isArray(data) ? data.sort((a, b) => a.id - b.id) : []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [user]);

  // const markCompleted = async (id: number) => {
  //   try {
  //     await notifyShopOrderCompleted(id);
  //     setOrders(prev =>
  //       prev.map(o => (o.id === id ? { ...o, status: "completed" } : o))
  //     );
  //     showToast("Order marked completed");
  //   } catch (err) {
  //     console.error(err);
  //     showToast("Failed to update order");
  //   }
  // };

  const cancelOrder = async (id: number) => {
    setPendingDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (pendingDeleteId === null) return;

    try {
      await deleteShopOrder(pendingDeleteId);
      setOrders(prev => prev.filter(o => o.id !== pendingDeleteId));
      showToast("Order cancelled successfully");
    } catch (err) {
      console.error(err);
      showToast("Failed to cancel order");
    } finally {
      setPendingDeleteId(null);
      setShowConfirm(false);
    }
  };

  return (
    <section className="orders-container">
      <h2>Your Orders</h2>

      {loading ? (
        <p>Loading...</p>
      ) : orders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <div className="orders-grid">
          {orders.map(order => (
            <div key={order.id} className="order-card">
              <div className="order-left">
                <strong>Order #{order.id}</strong>
                <div className="order-time">
                  Placed: {new Date(order.createdAt || order.created_at || "").toLocaleString()}
                </div>
              </div>

              <div className="order-actions">
                <span
                  className={`status-pill ${
                    order.status === "completed" ? "completed" : "pending"
                  }`}
                >
                  {(order.status || "pending").toUpperCase()}
                </span>

                <button className="btn gold" onClick={() => setSelectedOrder(order)}>
                  Details
                </button>

                {/* {order.status !== "completed" && (
                  <button className="btn primary" onClick={() => markCompleted(order.id)}>
                    Mark Completed
                  </button>
                )} */}

                <button className="btn danger" onClick={() => cancelOrder(order.id)}>
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ===== MODAL ===== */}
      {selectedOrder && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Order #{selectedOrder.id}</h3>

            <div className="modal-content">
              <div className="modal-item">
                <img
                  src={selectedOrder.image}
                  alt={selectedOrder.wearName}
                  loading="lazy"
                />
                <div>
                  <div><strong>{selectedOrder.wearName}</strong></div>
                  <div>Quantity: {selectedOrder.quantity}</div>
                  <div>Price: ₦{selectedOrder.total?.toLocaleString()}</div>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn gold" onClick={() => setSelectedOrder(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE MODAL */}
      {showConfirm && (
        <Confirm
          title="Cancel Order?"
          message="Are you sure you want to cancel this order?"
          onConfirm={confirmDelete}
          onCancel={() => {
            setPendingDeleteId(null);
            setShowConfirm(false);
          }}
        />
      )}
    </section>
  );
};

export default ShopOrders;

