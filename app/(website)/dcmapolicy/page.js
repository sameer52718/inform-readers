import {
  Shield,
  Scale,
  FileText,
  AlertTriangle,
  Mail,
  Clock,
  CheckCircle2,
  ExternalLink,
} from "lucide-react";

export default function DmcaPolicy() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-indigo-600 via-red-600 to-pink-500">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">DMCA Policy</h1>
            <p className="text-lg text-white">Last updated: April 2024</p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {/* Introduction */}
          <div className="prose prose-lg max-w-none mb-12">
            <p className="text-muted-foreground leading-relaxed">
              InformReaders.com respects the intellectual property rights of others and expects its users to
              do the same. In accordance with the Digital Millennium Copyright Act (DMCA), we will respond to
              notices of alleged copyright infringement that comply with applicable law.
            </p>
          </div>

          {/* Key DMCA Points */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div className="bg-gray-200 shadow-lg rounded-lg p-6 flex items-start gap-4">
              <Shield className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Copyright Protection</h3>
                <p className="text-sm text-muted-foreground">
                  We protect intellectual property rights and respond promptly to infringement notices
                </p>
              </div>
            </div>
            <div className="bg-gray-200 shadow-lg rounded-lg p-6 flex items-start gap-4">
              <Scale className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Fair Process</h3>
                <p className="text-sm text-muted-foreground">
                  We ensure a balanced approach to handling copyright claims and counter-notices
                </p>
              </div>
            </div>
            <div className="bg-gray-200 shadow-lg rounded-lg p-6 flex items-start gap-4">
              <Clock className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Timely Response</h3>
                <p className="text-sm text-muted-foreground">
                  Quick action on valid DMCA notices and counter-notices
                </p>
              </div>
            </div>
            <div className="bg-gray-200 shadow-lg rounded-lg p-6 flex items-start gap-4">
              <CheckCircle2 className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Compliance</h3>
                <p className="text-sm text-muted-foreground">
                  Full compliance with DMCA requirements and procedures
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Sections */}
          <div className="space-y-12">
            {/* Filing a DMCA Notice */}
            <div className="bg-gray-200 shadow-lg rounded-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <FileText className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Filing a DMCA Notice</h2>
              </div>
              <div className="space-y-4">
                <p className="text-muted-foreground">
                  To file a DMCA notice, your notification must include the following:
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Physical or electronic signature of the copyright owner</li>
                  <li>• Description of the copyrighted work claimed to be infringed</li>
                  <li>• Description of the infringing material and its location</li>
                  <li>• Your contact information</li>
                  <li>• Statement of good faith belief in infringement</li>
                  <li>• Statement of accuracy under penalty of perjury</li>
                </ul>
              </div>
            </div>

            {/* Counter Notice */}
            <div className="bg-gray-200 shadow-lg rounded-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <Scale className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Counter Notice Procedures</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  If you believe your content was removed in error, you may file a counter notice including:
                </p>
                <ul className="space-y-3">
                  <li>• Your physical or electronic signature</li>
                  <li>• Identification of removed material and its previous location</li>
                  <li>• Statement under penalty of perjury of good faith belief in removal error</li>
                  <li>• Your name, address, and phone number</li>
                  <li>• Consent to local federal court jurisdiction</li>
                </ul>
              </div>
            </div>

            {/* Warning Section */}
            <div className="bg-gray-200 shadow-lg rounded-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <AlertTriangle className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Important Notice</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Filing false DMCA notices or counter notices may result in legal consequences. We recommend
                  seeking legal counsel before filing any DMCA-related notices.
                </p>
                <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">Repeat Infringer Policy</h3>
                  <p>
                    We maintain a strict policy of terminating accounts of users who repeatedly infringe or
                    are charged with repeatedly infringing the copyrights or other intellectual property
                    rights of others.
                  </p>
                </div>
              </div>
            </div>

            {/* Third Party Claims */}
            <div className="bg-gray-200 shadow-lg rounded-lg p-8">
              <div className="flex items-center gap-3 mb-6">
                <ExternalLink className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold">Third Party Claims</h2>
              </div>
              <div className="space-y-4 text-muted-foreground">
                <p>If you receive a DMCA notice or counter notice regarding content on our platform:</p>
                <ul className="space-y-3">
                  <li>• Review the claim carefully</li>
                  <li>• Gather evidence supporting your position</li>
                  <li>• Consider seeking legal advice</li>
                  <li>• Respond within the specified timeframe</li>
                </ul>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-muted/30 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <Mail className="h-6 w-6 text-primary" />
                <h2 className="text-xl font-semibold">Submit DMCA Notices</h2>
              </div>
              <p className="text-muted-foreground">
                Send all DMCA notices and counter notices to our designated copyright agent at:
              </p>
              <p className="text-primary mt-2">dmca@informreaders.com</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
