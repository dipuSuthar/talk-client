// import nacl from "tweetnacl";
// import naclUtil from "tweetnacl-util";

// // Generate a new public/private key pair
// export function generateKeyPair() {
//   const keyPair = nacl.box.keyPair();
//   return {
//     publicKey: naclUtil.encodeBase64(keyPair.publicKey),
//     privateKey: naclUtil.encodeBase64(keyPair.secretKey),
//   };
// }

// // Encrypt a message using receiver's public key and sender's private key
// export function encryptMessage(
//   message,
//   receiverPublicKeyBase64,
//   senderPrivateKeyBase64
// ) {
//   const nonce = nacl.randomBytes(nacl.box.nonceLength);

//   const receiverPublicKey = naclUtil.decodeBase64(receiverPublicKeyBase64);
//   const senderPrivateKey = naclUtil.decodeBase64(senderPrivateKeyBase64);
//   const messageUint8 = naclUtil.decodeUTF8(message);

//   const encrypted = nacl.box(
//     messageUint8,
//     nonce,
//     receiverPublicKey,
//     senderPrivateKey
//   );

//   return {
//     encryptedMessage: naclUtil.encodeBase64(encrypted),
//     nonce: naclUtil.encodeBase64(nonce),
//   };
// }

// // Decrypt a message using sender's public key and receiver's private key
// export function decryptMessage(
//   encryptedMessageBase64,
//   nonceBase64,
//   senderPublicKeyBase64,
//   receiverPrivateKeyBase64
// ) {
//   const encryptedMessage = naclUtil.decodeBase64(encryptedMessageBase64);
//   const nonce = naclUtil.decodeBase64(nonceBase64);
//   const senderPublicKey = naclUtil.decodeBase64(senderPublicKeyBase64);
//   const receiverPrivateKey = naclUtil.decodeBase64(receiverPrivateKeyBase64);

//   const decrypted = nacl.box.open(
//     encryptedMessage,
//     nonce,
//     senderPublicKey,
//     receiverPrivateKey
//   );

//   if (!decrypted) throw new Error("Failed to decrypt message");

//   return naclUtil.encodeUTF8(decrypted);
// }
