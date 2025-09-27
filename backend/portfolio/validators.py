from django.core.validators import RegexValidator
from django.core.exceptions import ValidationError
import re
import bleach

class SecurityValidatorMixin:
    """Mixin to add security validations to serializers"""
    
    def validate_name(self, value):
        """Validate name fields"""
        if not value or len(value.strip()) < 2:
            raise ValidationError("Name must be at least 2 characters long")
        
        # Remove potentially dangerous characters
        cleaned_value = re.sub(r'[<>"\'\&]', '', value)
        if cleaned_value != value:
            raise ValidationError("Name contains invalid characters")
        
        return value.strip()
    
    def validate_email(self, value):
        """Enhanced email validation"""
        email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_regex, value):
            raise ValidationError("Enter a valid email address")
        return value.lower()
    
    def validate_phone(self, value):
        """Validate phone number format"""
        phone_regex = r'^\+?[\d\s\-\(\)]{10,15}$'
        if not re.match(phone_regex, value):
            raise ValidationError("Enter a valid phone number")
        return value
    
    def validate_url_field(self, value):
        """Validate URL fields"""
        if not value:
            return value
        
        allowed_schemes = ['http', 'https']
        if not any(value.startswith(scheme + '://') for scheme in allowed_schemes):
            raise ValidationError("URL must start with http:// or https://")
        
        # Basic URL pattern validation
        url_pattern = r'^https?://[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(/.*)?$'
        if not re.match(url_pattern, value):
            raise ValidationError("Enter a valid URL")
        
        return value
    
    def validate_text_content(self, value):
        """Sanitize text content to prevent XSS"""
        if not value:
            return value
        
        # Allow basic HTML tags but sanitize
        allowed_tags = ['p', 'br', 'strong', 'em', 'ul', 'ol', 'li', 'a']
        allowed_attributes = {'a': ['href']}
        
        cleaned_value = bleach.clean(
            value, 
            tags=allowed_tags, 
            attributes=allowed_attributes,
            strip=True
        )
        
        return cleaned_value

# Phone number validator
phone_validator = RegexValidator(
    regex=r'^\+?[\d\s\-\(\)]{10,15}$',
    message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
)

# URL validator for GitHub/LinkedIn
url_validator = RegexValidator(
    regex=r'^https?://[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(/.*)?$',
    message="Enter a valid URL starting with http:// or https://"
)
