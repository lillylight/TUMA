
import { useState } from "react";
import { FileUp, Send as SendIcon, User, Users, X } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import Header from "@/components/Header";

const Send = () => {
  const [file, setFile] = useState<File | null>(null);
  const [recipient, setRecipient] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!file) {
      toast.error("Please select a file to send");
      return;
    }
    
    if (!recipient) {
      toast.error("Please enter a recipient");
      return;
    }
    
    // Simulate sending
    setSending(true);
    
    setTimeout(() => {
      setSending(false);
      toast.success("Document sent successfully!");
      
      // Reset form
      setFile(null);
      setRecipient("");
      setMessage("");
    }, 2000);
  };

  const recentRecipients = [
    { id: 1, name: "Alice Chen", email: "alice@example.com" },
    { id: 2, name: "John Smith", email: "john@example.com" },
    { id: 3, name: "Finance Team", email: "finance@example.com" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 page-transition">
      <Header />
      
      <main className="pt-28 px-6 pb-16 max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Send Documents</h1>
          <p className="text-doc-medium-gray">
            Share documents securely with individuals or teams
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="glass-panel p-8">
              <form onSubmit={handleSubmit}>
                <div className="mb-8">
                  <label className="block text-sm font-medium mb-2">
                    Select Document
                  </label>
                  {!file ? (
                    <div className="border-2 border-dashed border-doc-pale-gray rounded-lg p-8 text-center">
                      <FileUp className="mx-auto h-12 w-12 text-doc-medium-gray mb-3" />
                      <p className="text-doc-medium-gray mb-4">
                        Drag and drop a file here, or click to select
                      </p>
                      <input
                        type="file"
                        className="hidden"
                        id="file-upload"
                        onChange={handleFileChange}
                      />
                      <label
                        htmlFor="file-upload"
                        className="inline-flex items-center px-4 py-2 bg-doc-deep-blue text-white rounded-lg hover:bg-blue-600 transition-colors cursor-pointer"
                      >
                        <FileUp size={16} className="mr-2" />
                        Select File
                      </label>
                    </div>
                  ) : (
                    <div className="flex items-center p-4 bg-doc-soft-blue rounded-lg animate-scale-in">
                      <div className="mr-4">
                        <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center">
                          <FileUp size={24} className="text-doc-deep-blue" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{file.name}</p>
                        <p className="text-xs text-doc-medium-gray">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={removeFile}
                        className="p-1.5 rounded-full hover:bg-white transition-colors text-doc-medium-gray"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="mb-6">
                  <label 
                    htmlFor="recipient"
                    className="block text-sm font-medium mb-2"
                  >
                    Recipient
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User size={18} className="text-doc-medium-gray" />
                    </div>
                    <input
                      type="text"
                      id="recipient"
                      placeholder="Email address or username"
                      className="pl-10 w-full bg-white border-none rounded-lg focus:ring-1 focus:ring-blue-500 outline-none py-3"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                    />
                  </div>
                </div>

                <div className="mb-8">
                  <label 
                    htmlFor="message"
                    className="block text-sm font-medium mb-2"
                  >
                    Message (Optional)
                  </label>
                  <textarea
                    id="message"
                    rows={4}
                    placeholder="Add a message to the recipient..."
                    className="w-full bg-white border-none rounded-lg focus:ring-1 focus:ring-blue-500 outline-none py-3 px-4"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={sending}
                    className={`
                      inline-flex items-center px-6 py-3 rounded-lg
                      ${sending
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-doc-deep-blue hover:bg-blue-600"}
                      text-white font-medium transition-colors
                    `}
                  >
                    {sending ? (
                      <>
                        <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <SendIcon size={18} className="mr-2" />
                        Send Document
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
          
          <div>
            <div className="glass-panel p-6">
              <div className="flex items-center mb-4">
                <Users size={18} className="text-doc-deep-blue mr-2" />
                <h3 className="font-medium">Recent Recipients</h3>
              </div>
              <div className="space-y-3">
                {recentRecipients.map((recipient) => (
                  <button
                    key={recipient.id}
                    onClick={() => setRecipient(recipient.email)}
                    className="flex items-center w-full p-3 rounded-lg hover:bg-doc-soft-blue transition-colors text-left"
                  >
                    <div className="w-8 h-8 rounded-full bg-doc-deep-blue text-white flex items-center justify-center mr-3">
                      {recipient.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium">{recipient.name}</p>
                      <p className="text-xs text-doc-medium-gray">{recipient.email}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
            
            <div className="glass-panel p-6 mt-6">
              <h3 className="font-medium mb-4">Send Tips</h3>
              <ul className="space-y-3 text-sm text-doc-medium-gray">
                <li className="flex">
                  <span className="text-doc-deep-blue mr-2">•</span>
                  Files are encrypted end-to-end for security
                </li>
                <li className="flex">
                  <span className="text-doc-deep-blue mr-2">•</span>
                  Maximum file size is 100MB
                </li>
                <li className="flex">
                  <span className="text-doc-deep-blue mr-2">•</span>
                  Recipients will receive an email notification
                </li>
                <li className="flex">
                  <span className="text-doc-deep-blue mr-2">•</span>
                  Documents expire after 30 days by default
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Send;
