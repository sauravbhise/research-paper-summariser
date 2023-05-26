import torch
from torch.utils.data import Dataset, DataLoader
from transformers import BertTokenizer, BertForSequenceClassification, BertConfig
from transformers import AdamW, get_linear_schedule_with_warmup
import pandas as pd

# Define a custom dataset class for summarization
class SummarizationDataset(Dataset):
    def __init__(self, csv_path, tokenizer, max_length):
        self.data = pd.read_csv(csv_path)
        self.tokenizer = tokenizer
        self.max_length = max_length

    def __len__(self):
        return len(self.data)

    def __getitem__(self, index):
        text = self.data.loc[index, 'text']
        summary = self.data.loc[index, 'summary']

        encoding = self.tokenizer.encode_plus(
            text,
            summary,
            max_length=self.max_length,
            padding='max_length',
            truncation=True,
            return_tensors='pt'
        )

        input_ids = encoding['input_ids'].squeeze()
        attention_mask = encoding['attention_mask'].squeeze()

        return {
            'input_ids': input_ids,
            'attention_mask': attention_mask,
            'labels': input_ids  # Set input_ids as labels for sequence classification
        }

# Load the pre-trained BERT model and tokenizer
model_name = 'bert-base-uncased'
model_config = BertConfig.from_pretrained(model_name)
model_config.num_labels = model_config.hidden_size  # Set num_labels same as hidden_size for sequence classification
model = BertForSequenceClassification.from_pretrained(model_name, config=model_config)
tokenizer = BertTokenizer.from_pretrained(model_name)

# Set the path to your CSV dataset
csv_path = 'scisumm.csv'

# Set the maximum sequence length
max_length = 512

# Create the dataset
dataset = SummarizationDataset(csv_path, tokenizer, max_length)

# Split the dataset into training and validation sets
train_size = int(0.8 * len(dataset))
val_size = len(dataset) - train_size
train_dataset, val_dataset = torch.utils.data.random_split(dataset, [train_size, val_size])

# Define the data loaders
batch_size = 2048
train_loader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
val_loader = DataLoader(val_dataset, batch_size=batch_size, shuffle=False)

# Set up the optimizer and learning rate scheduler
num_epochs = 5
total_steps = len(train_loader) * num_epochs
optimizer = AdamW(model.parameters(), lr=1e-5)
scheduler = get_linear_schedule_with_warmup(optimizer, num_warmup_steps=0, num_training_steps=total_steps)

# Set the device
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
model.to(device)

# Training loop
for epoch in range(num_epochs):
    model.train()
    total_loss = 0

    for batch in train_loader:
        input_ids = batch['input_ids'].to(device)
        attention_mask = batch['attention_mask'].to(device)
        labels = input_ids.clone()  # Use the input_ids as labels for sequence classification

        optimizer.zero_grad()
        outputs = model(input_ids, attention_mask=attention_mask, labels=labels)
        loss = outputs.loss
        total_loss += loss.item()
        loss.backward()
        optimizer.step()
        scheduler.step()

    # Calculate average training loss for the epoch
    avg_train_loss = total_loss / len(train_loader)

    # Validation loop
    model.eval()
    total_val_loss = 0

    for batch in val_loader:
        input_ids = batch['input_ids'].to(device)
        attention_mask = batch['attention_mask'].to(device)
        labels = input_ids.clone()  # Use the input_ids as labels for sequence classification

        with torch.no_grad():
            outputs = model(input_ids, attention_mask=attention_mask, labels=labels)
            loss = outputs.loss
            total_val_loss += loss.item()

    # Calculate average validation loss for the epoch
    avg_val_loss = total_val_loss / len(val_loader)

    # Print training and validation loss for the epoch
    print(f"Epoch {epoch+1}:")
    print(f"  Train Loss: {avg_train_loss:.4f}")
    print(f"  Val Loss: {avg_val_loss:.4f}")


